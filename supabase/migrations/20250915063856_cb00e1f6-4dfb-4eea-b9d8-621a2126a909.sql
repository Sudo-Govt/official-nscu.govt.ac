-- Create documents table for file management
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  category TEXT NOT NULL, -- 'transcript', 'certificate', 'announcement', 'course_material', 'policy'
  uploaded_by UUID REFERENCES auth.users(id),
  target_audience TEXT DEFAULT 'all', -- 'all', 'students', 'faculty', 'specific_student'
  target_user_id UUID REFERENCES auth.users(id), -- for specific student documents
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents
CREATE POLICY "Admins can manage all documents"
ON public.documents
FOR ALL
USING (is_admin());

CREATE POLICY "Students can view their own documents"
ON public.documents
FOR SELECT
USING (
  target_audience = 'all' 
  OR (target_audience = 'students' AND auth.uid() IN (SELECT user_id FROM profiles WHERE role = 'student'))
  OR target_user_id = auth.uid()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  target_audience TEXT DEFAULT 'all', -- 'all', 'students', 'faculty'
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on announcements table
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for announcements
CREATE POLICY "Admins can manage all announcements"
ON public.announcements
FOR ALL
USING (is_admin());

CREATE POLICY "Users can view active announcements"
ON public.announcements
FOR SELECT
USING (
  is_active = true 
  AND (expires_at IS NULL OR expires_at > now())
  AND (
    target_audience = 'all' 
    OR (target_audience = 'students' AND auth.uid() IN (SELECT user_id FROM profiles WHERE role = 'student'))
    OR (target_audience = 'faculty' AND auth.uid() IN (SELECT user_id FROM profiles WHERE role = 'faculty'))
  )
);

-- Create academic_calendar table
CREATE TABLE public.academic_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- 'exam', 'holiday', 'registration', 'semester_start', 'semester_end'
  start_date DATE NOT NULL,
  end_date DATE,
  is_important BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on academic_calendar table
ALTER TABLE public.academic_calendar ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for academic_calendar
CREATE POLICY "Admins can manage calendar events"
ON public.academic_calendar
FOR ALL
USING (is_admin());

CREATE POLICY "All users can view calendar events"
ON public.academic_calendar
FOR SELECT
USING (true);

-- Create storage buckets for document uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('student-documents', 'student-documents', false),
  ('announcements', 'announcements', true),
  ('course-materials', 'course-materials', false),
  ('certificates', 'certificates', false);

-- Create storage policies for student-documents bucket
CREATE POLICY "Admins can upload to student-documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'student-documents' AND is_admin());

CREATE POLICY "Admins can view student-documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'student-documents' AND is_admin());

CREATE POLICY "Students can view their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'student-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policies for announcements bucket (public)
CREATE POLICY "Admins can upload announcements"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'announcements' AND is_admin());

CREATE POLICY "Everyone can view announcements"
ON storage.objects
FOR SELECT
USING (bucket_id = 'announcements');

-- Create storage policies for course-materials bucket
CREATE POLICY "Admins can manage course materials"
ON storage.objects
FOR ALL
USING (bucket_id = 'course-materials' AND is_admin());

CREATE POLICY "Students can view course materials"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-materials');

-- Create storage policies for certificates bucket
CREATE POLICY "Admins can manage certificates"
ON storage.objects
FOR ALL
USING (bucket_id = 'certificates' AND is_admin());

CREATE POLICY "Students can view their own certificates"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add triggers for updated_at columns
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_calendar_updated_at
  BEFORE UPDATE ON public.academic_calendar
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();