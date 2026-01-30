-- Enhance library_books table with file upload, URL, and category support
ALTER TABLE public.library_books 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS file_path TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS external_url TEXT,
ADD COLUMN IF NOT EXISTS resource_type TEXT DEFAULT 'book',
ADD COLUMN IF NOT EXISTS access_roles TEXT[] DEFAULT ARRAY['student', 'alumni']::TEXT[],
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create index for faster searching
CREATE INDEX IF NOT EXISTS idx_library_books_category ON public.library_books(category);
CREATE INDEX IF NOT EXISTS idx_library_books_title ON public.library_books(title);
CREATE INDEX IF NOT EXISTS idx_library_books_author ON public.library_books(author);

-- Create library storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('library-files', 'library-files', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for library_books - allow students and alumni to read active books
DROP POLICY IF EXISTS "Students and alumni can view active library books" ON public.library_books;
CREATE POLICY "Students and alumni can view active library books" ON public.library_books
  FOR SELECT USING (
    is_active = true AND (
      EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = ANY(access_roles)
      ) OR
      EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('superadmin', 'admin', 'platform_admin')
      )
    )
  );

DROP POLICY IF EXISTS "Admins can manage library books" ON public.library_books;
CREATE POLICY "Admins can manage library books" ON public.library_books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('superadmin', 'admin', 'platform_admin')
    )
  );

-- Storage policies for library files
CREATE POLICY "Admins can upload library files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'library-files' AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('superadmin', 'admin', 'platform_admin')
    )
  );

CREATE POLICY "Users with access can download library files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'library-files' AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('student', 'alumni', 'superadmin', 'admin', 'platform_admin', 'faculty')
    )
  );

CREATE POLICY "Admins can delete library files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'library-files' AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('superadmin', 'admin', 'platform_admin')
    )
  );