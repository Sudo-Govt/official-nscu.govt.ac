-- Add more missing columns

-- Add columns to student_payments
ALTER TABLE public.student_payments
  ADD COLUMN IF NOT EXISTS payment_amount numeric,
  ADD COLUMN IF NOT EXISTS balance_amount numeric,
  ADD COLUMN IF NOT EXISTS agent_currency text,
  ADD COLUMN IF NOT EXISTS exchange_rate numeric;

-- Add column to courses
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS fee_structure jsonb;

-- Create alumni_jobs table
CREATE TABLE IF NOT EXISTS public.alumni_jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  company text NOT NULL,
  description text,
  location text,
  job_type text,
  salary_range text,
  posted_by uuid REFERENCES auth.users,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.alumni_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active jobs" ON public.alumni_jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Alumni can post jobs" ON public.alumni_jobs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'alumni')
);

-- Create alumni_mentorship table
CREATE TABLE IF NOT EXISTS public.alumni_mentorship (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id uuid REFERENCES auth.users NOT NULL,
  mentee_id uuid REFERENCES auth.users,
  program_name text NOT NULL,
  description text,
  status text DEFAULT 'available',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.alumni_mentorship ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mentorships" ON public.alumni_mentorship FOR SELECT USING (true);
CREATE POLICY "Alumni can create mentorships" ON public.alumni_mentorship FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('alumni', 'student'))
);

-- Create alumni_document_requests table
CREATE TABLE IF NOT EXISTS public.alumni_document_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  document_type text NOT NULL,
  purpose text,
  status text DEFAULT 'pending',
  requested_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE public.alumni_document_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own requests" ON public.alumni_document_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create requests" ON public.alumni_document_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage requests" ON public.alumni_document_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Create alumni_transcripts table
CREATE TABLE IF NOT EXISTS public.alumni_transcripts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  academic_year text,
  issued_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.alumni_transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transcripts" ON public.alumni_transcripts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage transcripts" ON public.alumni_transcripts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);