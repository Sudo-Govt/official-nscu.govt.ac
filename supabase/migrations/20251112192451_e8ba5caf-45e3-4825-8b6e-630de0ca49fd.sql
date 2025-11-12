-- Add remaining missing columns

-- Add columns to announcements
ALTER TABLE public.announcements
  ADD COLUMN target_audience text;

-- Add columns to student_applications
ALTER TABLE public.student_applications
  ADD COLUMN admission_year integer,
  ADD COLUMN admission_month text,
  ADD COLUMN academic_documents jsonb,
  ADD COLUMN previous_education jsonb;

-- Add columns to students
ALTER TABLE public.students
  ADD COLUMN course_name text,
  ADD COLUMN specialization text,
  ADD COLUMN exam_format text,
  ADD COLUMN cgpa numeric;

-- Fix json_content type in documents_generated (change to text for compatibility)
ALTER TABLE public.documents_generated
  ALTER COLUMN json_content TYPE text USING json_content::text;

-- Add columns to email_accounts
ALTER TABLE public.email_accounts
  ADD COLUMN display_name text,
  ADD COLUMN quota_mb integer DEFAULT 1000,
  ADD COLUMN last_synced_at timestamptz,
  ADD COLUMN cpanel_account_created boolean DEFAULT false;

-- Create smtp_settings table
CREATE TABLE public.smtp_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  smtp_host text NOT NULL,
  smtp_port integer NOT NULL,
  smtp_user text NOT NULL,
  smtp_password text NOT NULL,
  from_email text NOT NULL,
  from_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on smtp_settings
ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage SMTP settings
CREATE POLICY "Only admins can manage SMTP" ON public.smtp_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Add trigger for smtp_settings updated_at
CREATE TRIGGER update_smtp_settings_updated_at 
  BEFORE UPDATE ON public.smtp_settings 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add RLS policies for user_roles table
CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Add RLS policy for documents_generated
CREATE POLICY "Users can view their own generated documents" ON public.documents_generated FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage generated documents" ON public.documents_generated FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Fix search_path for all functions
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.generate_application_number() SET search_path = public;