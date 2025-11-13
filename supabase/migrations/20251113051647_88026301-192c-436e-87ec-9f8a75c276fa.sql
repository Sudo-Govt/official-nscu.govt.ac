-- Create app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM (
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
        'delegator'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure profiles table has unique constraint on user_id  
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);

-- Insert superadmin role for bhramar123@gmail.com (using text type)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'superadmin'
FROM auth.users
WHERE email = 'bhramar123@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_roles.user_id = auth.users.id 
  AND user_roles.role = 'superadmin'
);

-- Create/update profile
INSERT INTO public.profiles (user_id, full_name, status)
SELECT id, 'Admin User', 'active'
FROM auth.users
WHERE email = 'bhramar123@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.users.id
);

-- Update profile if it already exists
UPDATE public.profiles
SET status = 'active', full_name = COALESCE(full_name, 'Admin User')
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'bhramar123@gmail.com');