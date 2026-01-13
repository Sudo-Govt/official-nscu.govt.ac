-- Create job_postings table
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  job_type TEXT NOT NULL, -- full-time, part-time, contract, internship
  description TEXT NOT NULL,
  location TEXT,
  department TEXT,
  salary_min NUMERIC,
  salary_max NUMERIC,
  salary_currency TEXT DEFAULT 'USD',
  requirements TEXT[],
  benefits TEXT[],
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  tracking_number TEXT UNIQUE NOT NULL,
  
  -- Personal Information
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  nationality TEXT NOT NULL,
  current_address TEXT NOT NULL,
  permanent_address TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  identification_number TEXT,
  
  -- Educational Qualifications (JSON array)
  education JSONB DEFAULT '[]'::jsonb,
  
  -- Professional Experience (JSON array)
  experience JSONB DEFAULT '[]'::jsonb,
  
  -- Skills & Competencies
  technical_skills TEXT[],
  software_tools TEXT[],
  languages_known JSONB DEFAULT '[]'::jsonb,
  certifications TEXT[],
  
  -- Availability & Preferences
  willing_to_relocate BOOLEAN DEFAULT false,
  willing_to_travel BOOLEAN DEFAULT false,
  preferred_work_mode TEXT, -- on-site, hybrid, remote
  working_hours_availability TEXT,
  
  -- Resume
  resume_path TEXT,
  resume_filename TEXT,
  
  -- Status
  status TEXT DEFAULT 'submitted', -- submitted, under_review, shortlisted, interviewed, selected, rejected
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Job postings policies - anyone can view active jobs
CREATE POLICY "Anyone can view active job postings"
  ON public.job_postings FOR SELECT
  USING (is_active = true);

-- Admins can manage all job postings
CREATE POLICY "Admins can manage job postings"
  ON public.job_postings FOR ALL
  USING (public.is_admin(auth.uid()));

-- Job applications policies - applicants can submit
CREATE POLICY "Anyone can submit job applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (true);

-- Applicants can view their own applications
CREATE POLICY "Users can view their own applications by email"
  ON public.job_applications FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR public.is_admin(auth.uid()));

-- Admins can manage all applications
CREATE POLICY "Admins can manage job applications"
  ON public.job_applications FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create trigger for updating timestamps
CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate job application tracking number
CREATE OR REPLACE FUNCTION public.generate_job_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_number IS NULL THEN
    NEW.tracking_number := 'JOB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
      UPPER(SUBSTRING(NEW.id::TEXT, 1, 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_job_application_tracking
  BEFORE INSERT ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_job_tracking_number();

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-resumes', 'job-resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes
CREATE POLICY "Anyone can upload resumes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'job-resumes');

CREATE POLICY "Admins can view resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'job-resumes' AND public.is_admin(auth.uid()));