-- Update existing profile to superadmin role for the created user
UPDATE public.profiles 
SET role = 'superadmin'::user_role,
    full_name = 'Admin User',
    status = 'active'
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'bhramar123@gmail.com');

-- If no profile exists, create one
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
  'superadmin'::user_role,
  'active',
  now(),
  now()
FROM auth.users 
WHERE email = 'bhramar123@gmail.com'
  AND id NOT IN (SELECT user_id FROM public.profiles WHERE user_id IS NOT NULL);