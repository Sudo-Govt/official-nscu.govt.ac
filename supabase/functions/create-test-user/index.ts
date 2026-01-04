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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { email, password, full_name, is_test_account } = await req.json();

    console.log('Creating test user:', email);

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        is_test_account: true
      }
    });

    if (authError) {
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    const userId = authData.user.id;
    console.log('Auth user created:', userId);

    // Create profile with test account flag
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: userId,
        full_name,
        role: 'student',
        status: 'active',
        is_test_account: true
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // Assign student role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'student'
      });

    if (roleError) {
      console.error('Role assignment error:', roleError);
    }

    // Create student record
    const studentId = 'TEST' + Date.now();
    const { error: studentError } = await supabaseAdmin
      .from('students')
      .insert({
        user_id: userId,
        student_id: studentId,
        name: full_name,
        program: 'Payment Gateway Test Account',
        enrollment_year: new Date().getFullYear(),
        status: 'active',
        student_type: 'current',
        exam_format: 'Semester',
        cgpa: 3.5
      });

    if (studentError) {
      console.error('Student creation error:', studentError);
    }

    console.log('Test user created successfully:', email);

    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
        student_id: studentId,
        email,
        message: 'Test user created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating test user:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
