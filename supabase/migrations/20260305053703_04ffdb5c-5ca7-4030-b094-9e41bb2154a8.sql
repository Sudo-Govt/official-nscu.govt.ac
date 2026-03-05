
-- Fix is_admin() to use correct role names (superadmin, not super_admin)
-- Also add platform_admin for broader admin access
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin', 'platform_admin')
  )
$function$;

-- Also ensure alumni_profiles has a proper admin management policy
-- Drop potentially broken ones and recreate
DROP POLICY IF EXISTS "Admins can manage all alumni profiles" ON public.alumni_profiles;

CREATE POLICY "Admins can manage all alumni profiles"
ON public.alumni_profiles
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Also fix alumni_credentials so admin can manage and alumni can view
DROP POLICY IF EXISTS "Admins can manage alumni credentials" ON public.alumni_credentials;
CREATE POLICY "Admins can manage alumni credentials"
ON public.alumni_credentials
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Alumni can view own credentials" ON public.alumni_credentials;
CREATE POLICY "Alumni can view own credentials"
ON public.alumni_credentials
FOR SELECT
USING (auth.uid() = user_id);

-- Fix alumni_downloadable_resources RLS for admin and user access
DROP POLICY IF EXISTS "Admins can manage alumni resources" ON public.alumni_downloadable_resources;
CREATE POLICY "Admins can manage alumni resources"
ON public.alumni_downloadable_resources
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Alumni can view own resources" ON public.alumni_downloadable_resources;
CREATE POLICY "Alumni can view own resources"
ON public.alumni_downloadable_resources
FOR SELECT
USING (auth.uid() = user_id);

-- Fix alumni_dashboard_data RLS
DROP POLICY IF EXISTS "Admins can manage alumni dashboard data" ON public.alumni_dashboard_data;
CREATE POLICY "Admins can manage alumni dashboard data"
ON public.alumni_dashboard_data
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Alumni can view own dashboard data" ON public.alumni_dashboard_data;
CREATE POLICY "Alumni can view own dashboard data"
ON public.alumni_dashboard_data
FOR SELECT
USING (auth.uid() = user_id);
