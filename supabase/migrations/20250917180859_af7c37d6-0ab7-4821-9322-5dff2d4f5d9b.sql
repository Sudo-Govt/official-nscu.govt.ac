-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  dob DATE NOT NULL,
  address TEXT NOT NULL,
  course_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  exam_format TEXT NOT NULL CHECK (exam_format IN ('Semester', 'Year')),
  cgpa NUMERIC(3,2) NOT NULL CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table for generated documents
CREATE TABLE public.documents_generated (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('University', 'College', 'School', 'Board')),
  html_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents_generated ENABLE ROW LEVEL SECURITY;

-- RLS policies for students table
CREATE POLICY "Admins can manage all students" ON public.students
FOR ALL USING (is_admin());

-- RLS policies for documents_generated table
CREATE POLICY "Admins can manage all generated documents" ON public.documents_generated
FOR ALL USING (is_admin());

-- Add updated_at trigger for students
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();