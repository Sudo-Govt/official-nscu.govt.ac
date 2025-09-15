-- Update existing user to superadmin role
UPDATE profiles 
SET role = 'superadmin'::user_role, 
    full_name = 'Admin User',
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'bhramar123@gmail.com'
);