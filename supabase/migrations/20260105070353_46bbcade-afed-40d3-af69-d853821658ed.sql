-- SECURE SMTP SETTINGS TABLE
-- Remove plaintext password storage and restrict access

-- 1. First, ensure only superadmins can access SMTP settings
DROP POLICY IF EXISTS "Admins can view SMTP settings" ON public.smtp_settings;
DROP POLICY IF EXISTS "Admins can update SMTP settings" ON public.smtp_settings;
DROP POLICY IF EXISTS "Users can view SMTP settings" ON public.smtp_settings;

-- Only superadmins can view SMTP settings  
CREATE POLICY "Only superadmins can view SMTP settings"
ON public.smtp_settings
FOR SELECT
USING (public.has_role(auth.uid(), 'superadmin'));

-- Only superadmins can update SMTP settings
CREATE POLICY "Only superadmins can update SMTP settings"
ON public.smtp_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'superadmin'));

-- Only superadmins can insert SMTP settings
CREATE POLICY "Only superadmins can insert SMTP settings"
ON public.smtp_settings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'superadmin'));

-- Note: SMTP password should be stored in environment secrets (SMTP_PASSWORD) 
-- The smtp_password column can be used for encrypted storage or left empty