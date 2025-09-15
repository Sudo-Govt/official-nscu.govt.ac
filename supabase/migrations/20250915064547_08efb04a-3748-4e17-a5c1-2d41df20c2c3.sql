-- Create admin user with email and password
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'bhramar123@gmail.com',
  crypt('Sanam@1985', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User", "role": "admin"}'
);

-- Create corresponding profile for the admin user
INSERT INTO public.profiles (
  user_id,
  full_name,
  role,
  status,
  created_at,
  updated_at
) 
SELECT 
  id,
  'Admin User',
  'admin'::user_role,
  'active',
  now(),
  now()
FROM auth.users 
WHERE email = 'bhramar123@gmail.com';