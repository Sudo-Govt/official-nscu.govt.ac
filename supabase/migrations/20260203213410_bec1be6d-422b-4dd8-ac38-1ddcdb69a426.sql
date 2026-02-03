-- Create user_shared_files table for sharing files with specific users
CREATE TABLE public.user_shared_files (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    category TEXT NOT NULL DEFAULT 'document',
    title TEXT NOT NULL,
    description TEXT,
    shared_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.user_shared_files ENABLE ROW LEVEL SECURITY;

-- Users can view their own shared files
CREATE POLICY "Users can view their own shared files"
ON public.user_shared_files
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage all shared files
CREATE POLICY "Admins can manage shared files"
ON public.user_shared_files
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role IN ('superadmin', 'platform_admin', 'admin', 'admission_admin')
    )
);

-- Create index for faster lookups
CREATE INDEX idx_user_shared_files_user_id ON public.user_shared_files(user_id);
CREATE INDEX idx_user_shared_files_category ON public.user_shared_files(category);

-- Create storage bucket for shared user files if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-shared-files', 'user-shared-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for user-shared-files bucket
CREATE POLICY "Users can view own shared files in storage"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'user-shared-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can upload to user-shared-files"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'user-shared-files'
    AND EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role IN ('superadmin', 'platform_admin', 'admin', 'admission_admin')
    )
);

CREATE POLICY "Admins can delete from user-shared-files"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'user-shared-files'
    AND EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role IN ('superadmin', 'platform_admin', 'admin', 'admission_admin')
    )
);