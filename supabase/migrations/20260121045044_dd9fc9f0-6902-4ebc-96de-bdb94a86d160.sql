-- Reverse the hierarchy: Faculty is now parent of Department
-- Faculty -> Department -> Course (was Department -> Faculty -> Course)

-- Step 1: Add faculty_id to academic_departments
ALTER TABLE public.academic_departments 
ADD COLUMN faculty_id UUID REFERENCES public.academic_faculties(id) ON DELETE CASCADE;

-- Step 2: Remove department_id from academic_faculties
ALTER TABLE public.academic_faculties 
DROP COLUMN department_id;

-- Step 3: Update academic_courses to reference department_id instead of faculty_id
ALTER TABLE public.academic_courses 
ADD COLUMN department_id UUID REFERENCES public.academic_departments(id) ON DELETE CASCADE;

-- Step 4: Drop the old faculty_id column from academic_courses
ALTER TABLE public.academic_courses 
DROP COLUMN faculty_id;