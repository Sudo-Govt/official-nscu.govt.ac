-- Add navigation_parent_id to courses table to link courses to their navigation location
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS navigation_parent_id UUID REFERENCES public.site_navigation(id) ON DELETE SET NULL;

-- Set default navigation parent to "Course Catalog" (academics/course-catalog)
-- First, create a function to get the Course Catalog navigation ID
CREATE OR REPLACE FUNCTION public.get_course_catalog_nav_id()
RETURNS UUID AS $$
DECLARE
  nav_id UUID;
BEGIN
  SELECT id INTO nav_id FROM public.site_navigation 
  WHERE href = '/academics/course-catalog' 
  LIMIT 1;
  RETURN nav_id;
END;
$$ LANGUAGE plpgsql STABLE SET search_path = public;

-- Update all existing courses to be under Course Catalog
UPDATE public.courses 
SET navigation_parent_id = (
  SELECT id FROM public.site_navigation 
  WHERE href = '/academics/course-catalog' 
  LIMIT 1
)
WHERE navigation_parent_id IS NULL;

-- Create a trigger to auto-set navigation_parent_id for new courses
CREATE OR REPLACE FUNCTION public.set_default_course_navigation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.navigation_parent_id IS NULL THEN
    NEW.navigation_parent_id := public.get_course_catalog_nav_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS set_course_navigation_trigger ON public.courses;
CREATE TRIGGER set_course_navigation_trigger
  BEFORE INSERT ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.set_default_course_navigation();

-- Add comment for documentation
COMMENT ON COLUMN public.courses.navigation_parent_id IS 'Links course to its parent navigation location. Defaults to Course Catalog.';