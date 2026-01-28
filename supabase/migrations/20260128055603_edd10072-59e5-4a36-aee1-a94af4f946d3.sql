-- Phase 1: Add missing columns to academic_courses for course consolidation
ALTER TABLE public.academic_courses
ADD COLUMN IF NOT EXISTS fee_structure JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS college TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS department TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS degree_type TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS seat_capacity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS available_seats INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS eligibility_criteria TEXT DEFAULT NULL;

-- Phase 2: Create alumni_dashboard_data table for personalized alumni dashboards
CREATE TABLE public.alumni_dashboard_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  graduation_info JSONB DEFAULT '{}',
  career_history JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  assigned_resources UUID[] DEFAULT '{}',
  visible_sections TEXT[] DEFAULT ARRAY['profile', 'career', 'networking', 'documents', 'chatroom'],
  custom_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for alumni_dashboard_data
ALTER TABLE public.alumni_dashboard_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alumni can view their own dashboard data"
ON public.alumni_dashboard_data FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all alumni dashboard data"
ON public.alumni_dashboard_data FOR ALL
USING (is_admin(auth.uid()));

-- Phase 3: Create alumni_downloadable_resources table
CREATE TABLE public.alumni_downloadable_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for alumni_downloadable_resources
ALTER TABLE public.alumni_downloadable_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alumni can view their own resources"
ON public.alumni_downloadable_resources FOR SELECT
USING (user_id = auth.uid() AND is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can manage all alumni resources"
ON public.alumni_downloadable_resources FOR ALL
USING (is_admin(auth.uid()));

-- Phase 4: Enhance student_dashboard_data with course assignments
ALTER TABLE public.student_dashboard_data
ADD COLUMN IF NOT EXISTS enrolled_course_id UUID REFERENCES public.academic_courses(id),
ADD COLUMN IF NOT EXISTS enrolled_subjects UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS assigned_library_books UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS progress_graph_data JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS custom_resources UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS visible_sections TEXT[] DEFAULT ARRAY['courses', 'library', 'progress', 'assignments'];

-- Create updated_at trigger for new tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_alumni_dashboard_data_updated_at
BEFORE UPDATE ON public.alumni_dashboard_data
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alumni_downloadable_resources_updated_at
BEFORE UPDATE ON public.alumni_downloadable_resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_alumni_dashboard_data_user_id ON public.alumni_dashboard_data(user_id);
CREATE INDEX IF NOT EXISTS idx_alumni_downloadable_resources_user_id ON public.alumni_downloadable_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_academic_courses_featured ON public.academic_courses(featured) WHERE featured = true;