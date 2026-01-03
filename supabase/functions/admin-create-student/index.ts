import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client with service role key for user creation
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create regular client for auth check
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Verify the requesting user is an admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'superadmin'])
      .single();

    if (roleError || !roleData) {
      throw new Error('Unauthorized: Admin access required');
    }

    const requestData = await req.json();
    const { 
      email, 
      password, 
      full_name,
      phone,
      date_of_birth,
      father_name,
      mother_name,
      address,
      course_id,
      course_name,
      specialization,
      enrollment_year,
      program,
      student_type
    } = requestData;

    // Validate required fields
    if (!email || !password || !full_name) {
      throw new Error('Email, password, and full name are required');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    console.log('Creating student user:', email);

    // Create auth user with admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name,
        requires_password_change: true
      }
    });

    if (authError) {
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    const newUserId = authData.user.id;
    console.log('Auth user created:', newUserId);

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: newUserId,
        full_name,
        phone,
        role: 'student',
        status: 'active'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // Assign student role
    const { error: roleInsertError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUserId,
        role: 'student'
      });

    if (roleInsertError) {
      console.error('Role assignment error:', roleInsertError);
    }

    // Generate student ID
    const studentId = 'STU' + Date.now();

    // Create student record
    const { data: studentData, error: studentError } = await supabaseAdmin
      .from('students')
      .insert({
        user_id: newUserId,
        student_id: studentId,
        name: full_name,
        dob: date_of_birth,
        father_name,
        mother_name,
        address,
        course_id: course_id || null,
        course_name,
        specialization,
        program: program || course_name || 'General',
        enrollment_year: enrollment_year || new Date().getFullYear(),
        status: 'active',
        student_type: student_type || 'current',
        exam_format: 'Semester',
        cgpa: 0
      })
      .select()
      .single();

    if (studentError) {
      throw new Error(`Failed to create student record: ${studentError.message}`);
    }

    console.log('Student created successfully:', studentId);

    return new Response(
      JSON.stringify({
        success: true,
        user_id: newUserId,
        student_id: studentId,
        email,
        message: 'Student account created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating student:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
