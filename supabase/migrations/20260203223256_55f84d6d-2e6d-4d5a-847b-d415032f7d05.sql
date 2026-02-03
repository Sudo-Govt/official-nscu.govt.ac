-- Drop the existing foreign key that points to the wrong table
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_course_id_fkey;

-- Add the correct foreign key to academic_courses
ALTER TABLE public.students 
ADD CONSTRAINT students_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES public.academic_courses(id) ON DELETE SET NULL;