
-- Create personal-drives bucket for user files (private, 100MB quota enforced in app)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('personal-drives', 'personal-drives', false, 52428800)
ON CONFLICT (id) DO NOTHING;

-- RLS: Users can manage their own files (path starts with their user_id)
CREATE POLICY "Users manage own drive files"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'personal-drives' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'personal-drives' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS: Admins can view all drive files
CREATE POLICY "Admins view all drive files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'personal-drives' AND public.is_admin());

-- Create drive-quota tracking table
CREATE TABLE IF NOT EXISTS public.drive_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  quota_bytes BIGINT NOT NULL DEFAULT 104857600,
  used_bytes BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.drive_quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own quota"
ON public.drive_quotas FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users update own quota"
ON public.drive_quotas FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "System insert quota"
ON public.drive_quotas FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins manage all quotas"
ON public.drive_quotas FOR ALL
TO authenticated
USING (public.is_admin());

-- Also ensure library-files bucket has admin upload policy
CREATE POLICY "Admins manage library files"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'library-files' AND public.is_admin())
WITH CHECK (bucket_id = 'library-files' AND public.is_admin());

-- All authenticated users can read library files
CREATE POLICY "Authenticated read library files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'library-files');
