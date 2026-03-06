
-- Table to map courseware files to specific students
CREATE TABLE public.student_courseware (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'document',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.student_courseware ENABLE ROW LEVEL SECURITY;

-- Admins can manage all courseware assignments
CREATE POLICY "Admins can manage student courseware"
ON public.student_courseware
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Students can view their own assigned courseware
CREATE POLICY "Students can view own courseware"
ON public.student_courseware
FOR SELECT
USING (auth.uid() = student_user_id);
