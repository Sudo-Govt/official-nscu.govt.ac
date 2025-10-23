-- CRITICAL SECURITY FIX: Update admin functions to use user_roles table instead of profiles.role
-- This prevents privilege escalation attacks where users could modify their own role

-- Update is_admin() function to only check user_roles table (matching is_admin_role pattern)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('superadmin'::app_role, 'registrar'::app_role)
  );
$function$;

-- Update is_superadmin() function to only check user_roles table
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'superadmin'::app_role
  );
$function$;

-- Update the profile update policy to prevent users from modifying their own role
-- Users can update their profile ONLY if they don't change the role field, or if they are admins
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add a separate check constraint via trigger to prevent role changes
CREATE OR REPLACE FUNCTION prevent_role_self_modification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role AND NOT is_admin() THEN
    RAISE EXCEPTION 'Only administrators can modify user roles';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS check_role_modification ON profiles;
CREATE TRIGGER check_role_modification
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_self_modification();

-- Add explicit policy to prevent anonymous users from any access to profiles
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON profiles;
CREATE POLICY "Deny anonymous access to profiles" ON profiles
  FOR ALL
  TO anon
  USING (false);

-- Add comments to document the security fix
COMMENT ON FUNCTION public.is_admin() IS 'SECURITY: Only checks user_roles table to prevent privilege escalation. Do not modify to check profiles.role.';
COMMENT ON FUNCTION public.is_superadmin() IS 'SECURITY: Only checks user_roles table to prevent privilege escalation. Do not modify to check profiles.role.';
COMMENT ON TRIGGER check_role_modification ON profiles IS 'SECURITY: Prevents users from modifying their own role field. Only admins can change roles.';