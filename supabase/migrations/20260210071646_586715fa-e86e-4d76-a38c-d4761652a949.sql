
-- Fix is_admin() to check user_roles table instead of profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  )
$$;

-- Fix is_superadmin() to check user_roles table instead of profiles
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
  )
$$;

-- Add RLS to smtp_settings if not already enabled
ALTER TABLE IF EXISTS public.smtp_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing permissive policies on smtp_settings if any
DROP POLICY IF EXISTS "Allow all access to smtp_settings" ON public.smtp_settings;
DROP POLICY IF EXISTS "Admins can manage smtp_settings" ON public.smtp_settings;

-- Only admins can view/manage SMTP settings
CREATE POLICY "Admins can view smtp_settings"
ON public.smtp_settings
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can manage smtp_settings"
ON public.smtp_settings
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Add RLS to user_presence if not already enabled
ALTER TABLE IF EXISTS public.user_presence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to user_presence" ON public.user_presence;
DROP POLICY IF EXISTS "Users can manage own presence" ON public.user_presence;
DROP POLICY IF EXISTS "Authenticated can view presence" ON public.user_presence;

-- Users can manage their own presence
CREATE POLICY "Users can manage own presence"
ON public.user_presence
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Authenticated users can view all presence (for online status)
CREATE POLICY "Authenticated can view presence"
ON public.user_presence
FOR SELECT
TO authenticated
USING (true);
