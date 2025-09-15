-- Create the admin user manually
DO $$
DECLARE
    user_id_var UUID := gen_random_uuid();
BEGIN
    -- Insert the user into auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        user_id_var,
        'authenticated',
        'authenticated',
        'bhramar123@gmail.com',
        crypt('Sanam@1985', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Admin User"}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );

    -- Create corresponding profile
    INSERT INTO public.profiles (
        user_id,
        full_name,
        role,
        status
    ) VALUES (
        user_id_var,
        'Admin User',
        'superadmin'::user_role,
        'active'
    );
END $$;