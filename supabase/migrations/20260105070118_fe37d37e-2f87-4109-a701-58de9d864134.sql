-- FIX CRITICAL RLS ISSUES - Public data exposure

-- 1. Fix phd_applications table - only admins can view
DROP POLICY IF EXISTS "Admins can view all PhD applications" ON public.phd_applications;
DROP POLICY IF EXISTS "Anyone can submit PhD applications" ON public.phd_applications;
DROP POLICY IF EXISTS "Users can submit PhD applications" ON public.phd_applications;

-- Allow public submissions (needed for public form)
CREATE POLICY "Anyone can submit PhD applications"
ON public.phd_applications
FOR INSERT
WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Only admins can view PhD applications"
ON public.phd_applications
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Only admins can update
CREATE POLICY "Only admins can update PhD applications"
ON public.phd_applications
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- 2. Fix contact_submissions table - only admins can view
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can submit contact forms" ON public.contact_submissions;

-- Allow public submissions (needed for contact form)
CREATE POLICY "Anyone can submit contact forms"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Only admins can update
CREATE POLICY "Only admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- 3. Fix alumni_profiles - restrict to authenticated users only
DROP POLICY IF EXISTS "Anyone can view alumni profiles" ON public.alumni_profiles;
DROP POLICY IF EXISTS "Authenticated users can view alumni profiles" ON public.alumni_profiles;
DROP POLICY IF EXISTS "Alumni can update their own profile" ON public.alumni_profiles;

-- Only authenticated users can view alumni profiles
CREATE POLICY "Authenticated users can view alumni profiles"
ON public.alumni_profiles
FOR SELECT
TO authenticated
USING (true);

-- Alumni can only update their own profile
CREATE POLICY "Alumni can update own profile"
ON public.alumni_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Alumni can insert their own profile
CREATE POLICY "Alumni can insert own profile"
ON public.alumni_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);