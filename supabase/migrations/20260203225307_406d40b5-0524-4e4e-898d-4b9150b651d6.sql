-- Add course_id column to alumni_profiles for course association
ALTER TABLE public.alumni_profiles 
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.academic_courses(id);

-- Add course_code column for quick reference
ALTER TABLE public.alumni_profiles 
ADD COLUMN IF NOT EXISTS course_code TEXT;

-- Add course_name column for display
ALTER TABLE public.alumni_profiles 
ADD COLUMN IF NOT EXISTS course_name TEXT;

-- Add faculty_id and department_id for proper hierarchy
ALTER TABLE public.alumni_profiles 
ADD COLUMN IF NOT EXISTS faculty_id UUID REFERENCES public.academic_faculties(id);

ALTER TABLE public.alumni_profiles 
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.academic_departments(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_course_id ON public.alumni_profiles(course_id);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_department_id ON public.alumni_profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_faculty_id ON public.alumni_profiles(faculty_id);