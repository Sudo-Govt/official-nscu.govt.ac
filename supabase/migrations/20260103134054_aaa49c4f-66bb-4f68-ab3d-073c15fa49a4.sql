-- Add new columns to courses table for comprehensive course information
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS curriculum_data JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS brochure_url TEXT,
ADD COLUMN IF NOT EXISTS application_deadline DATE,
ADD COLUMN IF NOT EXISTS reference_books JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS career_outcomes JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS faculty_info JSONB DEFAULT '[]'::jsonb;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);

-- Create index on featured for faster filtering
CREATE INDEX IF NOT EXISTS idx_courses_featured ON public.courses(featured) WHERE featured = true;