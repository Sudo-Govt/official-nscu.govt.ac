-- Add student_type column to students table (current or alumni)
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS student_type text DEFAULT 'current' CHECK (student_type IN ('current', 'alumni'));

-- Add course_id column to link students to their specific course
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES public.courses(id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_students_course_id ON public.students(course_id);
CREATE INDEX IF NOT EXISTS idx_students_student_type ON public.students(student_type);