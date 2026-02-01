-- Phase 1: Database Schema Enhancements for Academic Hierarchy

-- 1.1 Enhance academic_faculties with CMS fields
ALTER TABLE public.academic_faculties 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS statistics JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS research_centers JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS special_programs JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS alumni_highlights JSONB DEFAULT '[]';

-- Create unique index on slug for faculties
CREATE UNIQUE INDEX IF NOT EXISTS idx_academic_faculties_slug ON public.academic_faculties(slug) WHERE slug IS NOT NULL;

-- 1.2 Enhance academic_departments with CMS fields
ALTER TABLE public.academic_departments 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS long_description TEXT;

-- Create unique index on slug for departments
CREATE UNIQUE INDEX IF NOT EXISTS idx_academic_departments_slug ON public.academic_departments(slug) WHERE slug IS NOT NULL;

-- 1.3 Enhance academic_courses with degree level and detailed semester info
ALTER TABLE public.academic_courses 
ADD COLUMN IF NOT EXISTS degree_level TEXT DEFAULT 'undergraduate',
ADD COLUMN IF NOT EXISTS admission_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS semester_details JSONB DEFAULT '[]';

-- Create index on degree_level for filtering
CREATE INDEX IF NOT EXISTS idx_academic_courses_degree_level ON public.academic_courses(degree_level);

-- 1.4 Enhance academic_subjects with detailed syllabus info
ALTER TABLE public.academic_subjects 
ADD COLUMN IF NOT EXISTS syllabus_units JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS reference_books JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS learning_outcomes TEXT[],
ADD COLUMN IF NOT EXISTS assessment_methods JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS subject_type TEXT DEFAULT 'core';

-- Create function to auto-generate slug from name
CREATE OR REPLACE FUNCTION public.generate_slug_from_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply slug trigger to faculties
DROP TRIGGER IF EXISTS generate_faculty_slug ON public.academic_faculties;
CREATE TRIGGER generate_faculty_slug
  BEFORE INSERT OR UPDATE ON public.academic_faculties
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_slug_from_name();

-- Apply slug trigger to departments
DROP TRIGGER IF EXISTS generate_department_slug ON public.academic_departments;
CREATE TRIGGER generate_department_slug
  BEFORE INSERT OR UPDATE ON public.academic_departments
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_slug_from_name();