import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_ROLES = [
  'admin',
  'superadmin',
  'student',
  'faculty',
  'admission_agent',
  'finance',
  'alumni',
  'staff',
  'accounts',
  'registrar',
  'auditor',
  'delegator',
  'platform_admin',
  'hr_admin',
  'compliance_admin',
  'admission_admin',
  'admission_staff',
  'master_agent',
  'support',
  'marketing_admin',
] as const;

type AllowedRole = (typeof ALLOWED_ROLES)[number];

function isAllowedRole(role: unknown): role is AllowedRole {
  return typeof role === 'string' && (ALLOWED_ROLES as readonly string[]).includes(role);
}

function validateEmail(email: unknown): string {
  if (typeof email !== 'string') throw new Error('Invalid email');
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) throw new Error('Email is required');
  if (trimmed.length > 255) throw new Error('Email is too long');
  // Basic RFC-like check
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  if (!ok) throw new Error('Invalid email format');
  return trimmed;
}

function validatePassword(password: unknown): string {
  if (typeof password !== 'string') throw new Error('Invalid password');
  if (password.length < 8) throw new Error('Password must be at least 8 characters');
  return password;
}

function validateName(name: unknown): string {
  if (typeof name !== 'string') throw new Error('Invalid full_name');
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Full name is required');
  if (trimmed.length > 120) throw new Error('Full name is too long');
  return trimmed;
}

function safeString(v: unknown, max = 200): string | null {
  if (v === undefined || v === null) return null;
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (!t) return null;
  return t.length > max ? t.slice(0, max) : t;
}

async function generateUniqueAgentCode(supabaseAdmin: ReturnType<typeof createClient>): Promise<string> {
  for (let i = 0; i < 15; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data } = await supabaseAdmin
      .from('agent_profiles')
      .select('agent_id')
      .eq('agent_id', code)
      .maybeSingle();

    if (!data) return code;
  }
  throw new Error('Failed to generate unique agent code');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify requester
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: requestingUser }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !requestingUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check requester role from user_roles (source of truth)
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', requestingUser.id);

    if (rolesError) {
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requesterRoles = (roles ?? []).map((r) => r.role);
    const isSuperadmin = requesterRoles.includes('superadmin');
    const hasCreateAccess = requesterRoles.some((r) => ['superadmin', 'admin', 'platform_admin'].includes(r));

    if (!hasCreateAccess) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const email = validateEmail(body.email);
    const password = validatePassword(body.password);
    const full_name = validateName(body.full_name);

    const role = body.role;
    if (!isAllowedRole(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isSuperadmin && role === 'superadmin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden - superadmin can only be created by a superadmin' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const department = safeString(body.department, 120);
    const phone = safeString(body.phone, 40);
    
    // Student-specific fields
    const course_id = safeString(body.course_id, 50);
    const course_code = safeString(body.course_code, 50);
    const course_name = safeString(body.course_name, 200);
    const faculty_id = safeString(body.faculty_id, 50);
    const department_id = safeString(body.department_id, 50);
    const date_of_birth = safeString(body.date_of_birth, 20);
    const father_name = safeString(body.father_name, 120);
    const mother_name = safeString(body.mother_name, 120);
    const address = safeString(body.address, 500);
    const enrollment_year = body.enrollment_year ? parseInt(body.enrollment_year) : new Date().getFullYear();

    // Create auth user (service role)
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        requires_password_change: true,
      },
    });

    if (createError || !created.user) {
      return new Response(
        JSON.stringify({ error: createError?.message ?? 'Failed to create user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newUserId = created.user.id;

    // Ensure profile exists (update first, insert if missing)
    const profilePayload = {
      full_name,
      phone,
      status: 'active',
      metadata: {
        department,
        created_by: requestingUser.id,
      },
    };

    const { data: updatedProfiles, error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .update(profilePayload)
      .eq('user_id', newUserId)
      .select('id');

    if (profileUpdateError) {
      // If update fails due to missing row, try insert.
      // (We avoid upsert without knowing unique constraints)
      const { error: profileInsertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: newUserId,
          ...profilePayload,
        });

      if (profileInsertError) {
        console.error('Profile insert error:', profileInsertError);
      }
    } else if (!updatedProfiles || updatedProfiles.length === 0) {
      const { error: profileInsertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: newUserId,
          ...profilePayload,
        });

      if (profileInsertError) {
        console.error('Profile insert error:', profileInsertError);
      }
    }

    // Assign role (single source of truth)
    await supabaseAdmin.from('user_roles').delete().eq('user_id', newUserId);

    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: newUserId, role });

    if (roleError) {
      return new Response(
        JSON.stringify({ error: `User created but role assignment failed: ${roleError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If agent role, ensure agent profile exists
    let agent_code: string | null = null;
    if (role === 'admission_agent' || role === 'master_agent') {
      agent_code = await generateUniqueAgentCode(supabaseAdmin);
      const { error: agentError } = await supabaseAdmin
        .from('agent_profiles')
        .insert({
          user_id: newUserId,
          agent_id: agent_code,
          contact_info: {
            email,
            phone: phone ?? '',
            address: '',
          },
          kyc_status: 'pending',
          commission_rate: 10,
          total_earnings: 0,
          preferred_currency: 'USD',
          status: 'active',
        });

      if (agentError) {
        console.error('Agent profile creation error:', agentError);
      }
    }

    // If student role, create student record
    let student_id: string | null = null;
    if (role === 'student') {
      // Generate student ID
      student_id = 'STU' + Date.now();
      
      // Resolve course details if course_code provided but not course_id
      let resolvedCourseId = course_id;
      let resolvedCourseName = course_name;
      
      if (course_code && !course_id) {
        const { data: courseData } = await supabaseAdmin
          .from('academic_courses')
          .select('id, name')
          .eq('course_code', course_code)
          .maybeSingle();
        
        if (courseData) {
          resolvedCourseId = courseData.id;
          resolvedCourseName = resolvedCourseName || courseData.name;
        }
      }

      const { error: studentError } = await supabaseAdmin
        .from('students')
        .insert({
          user_id: newUserId,
          student_id,
          name: full_name,
          dob: date_of_birth,
          father_name,
          mother_name,
          address,
          course_id: resolvedCourseId,
          course_name: resolvedCourseName,
          program: resolvedCourseName || 'General',
          enrollment_year,
          status: 'active',
          student_type: 'current',
          exam_format: 'Semester',
          cgpa: 0,
        });

      if (studentError) {
        console.error('Student record creation error:', studentError);
      }
    }

    // If alumni role, create alumni profile
    if (role === 'alumni') {
      const { error: alumniError } = await supabaseAdmin
        .from('alumni_profiles')
        .insert({
          user_id: newUserId,
          graduation_year: enrollment_year || new Date().getFullYear(),
          program: course_name || 'General',
        });

      if (alumniError) {
        console.error('Alumni profile creation error:', alumniError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        user_id: newUserId,
        role,
        agent_code,
        student_id,
        message: 'User created successfully',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('admin-create-user error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
