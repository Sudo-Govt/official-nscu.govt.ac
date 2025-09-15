-- Create alumni_profiles table for extended alumni information
CREATE TABLE public.alumni_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  alumni_id TEXT UNIQUE NOT NULL DEFAULT 'AL' || to_char(now(), 'YYYY') || lpad(floor(random() * 100000)::text, 5, '0'),
  graduation_year INTEGER NOT NULL,
  graduation_month INTEGER DEFAULT 6,
  program TEXT NOT NULL,
  degree_type TEXT NOT NULL,
  college TEXT,
  major TEXT,
  minor TEXT,
  gpa DECIMAL(3,2),
  honors TEXT,
  current_company TEXT,
  current_position TEXT,
  industry TEXT,
  location TEXT,
  linkedin_url TEXT,
  personal_website TEXT,
  bio TEXT,
  achievements TEXT[],
  skills TEXT[],
  interests TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_public_profile BOOLEAN DEFAULT true,
  allow_mentorship BOOLEAN DEFAULT false,
  allow_networking BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_credentials table for digital certificates and transcripts
CREATE TABLE public.alumni_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL, -- 'degree', 'transcript', 'certificate', 'diploma'
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  verification_hash TEXT UNIQUE,
  blockchain_hash TEXT,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT false,
  verification_count INTEGER DEFAULT 0,
  last_verified_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_events table
CREATE TABLE public.alumni_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- 'reunion', 'networking', 'professional', 'social', 'fundraising'
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  virtual_link TEXT,
  is_virtual BOOLEAN DEFAULT false,
  max_attendees INTEGER,
  registration_fee DECIMAL(10,2) DEFAULT 0,
  target_graduation_years INTEGER[],
  target_colleges TEXT[],
  image_url TEXT,
  created_by UUID REFERENCES public.profiles(user_id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_event_registrations table
CREATE TABLE public.alumni_event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.alumni_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'registered', -- 'registered', 'attended', 'cancelled'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  guest_count INTEGER DEFAULT 0,
  special_requirements TEXT,
  UNIQUE(event_id, user_id)
);

-- Create alumni_mentorship table
CREATE TABLE public.alumni_mentorship (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  program_type TEXT NOT NULL, -- 'career', 'academic', 'entrepreneurship', 'industry'
  status TEXT DEFAULT 'pending', -- 'pending', 'active', 'completed', 'cancelled'
  start_date DATE,
  end_date DATE,
  goals TEXT,
  meeting_frequency TEXT, -- 'weekly', 'biweekly', 'monthly'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_jobs table
CREATE TABLE public.alumni_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  posted_by UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  job_type TEXT NOT NULL, -- 'full-time', 'part-time', 'contract', 'internship'
  location TEXT,
  remote_ok BOOLEAN DEFAULT false,
  salary_min INTEGER,
  salary_max INTEGER,
  currency TEXT DEFAULT 'USD',
  application_url TEXT,
  application_email TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_donations table
CREATE TABLE public.alumni_donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  donation_type TEXT NOT NULL, -- 'scholarship', 'general', 'research', 'infrastructure', 'emergency'
  purpose TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  payment_method TEXT,
  transaction_id TEXT,
  receipt_url TEXT,
  tax_receipt_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_document_requests table
CREATE TABLE public.alumni_document_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'transcript', 'degree_certificate', 'enrollment_verification', 'grade_report'
  purpose TEXT NOT NULL,
  delivery_method TEXT NOT NULL, -- 'digital', 'physical', 'both'
  delivery_address TEXT,
  quantity INTEGER DEFAULT 1,
  urgent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'ready', 'delivered', 'cancelled'
  notes TEXT,
  admin_notes TEXT,
  fee DECIMAL(8,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  estimated_delivery DATE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_chapters table
CREATE TABLE public.alumni_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  region TEXT,
  country TEXT NOT NULL,
  chapter_head UUID REFERENCES public.profiles(user_id),
  contact_email TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  member_count INTEGER DEFAULT 0,
  founded_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_chapter_members table
CREATE TABLE public.alumni_chapter_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES public.alumni_chapters(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'member', 'officer', 'head'
  joined_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(chapter_id, user_id)
);

-- Create alumni_verification_requests table
CREATE TABLE public.alumni_verification_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_organization TEXT,
  alumni_id TEXT,
  alumni_name TEXT,
  verification_type TEXT NOT NULL, -- 'degree', 'enrollment', 'graduation', 'employment'
  purpose TEXT NOT NULL,
  documents_needed TEXT[],
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
  admin_notes TEXT,
  verification_result JSONB,
  fee DECIMAL(8,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_support_tickets table
CREATE TABLE public.alumni_support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'technical', 'documents', 'events', 'donations', 'general'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  assigned_to UUID REFERENCES public.profiles(user_id),
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_mentorship ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_chapter_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alumni_profiles
CREATE POLICY "Alumni can view public profiles" ON public.alumni_profiles
  FOR SELECT USING (is_public_profile = true);

CREATE POLICY "Alumni can view and update own profile" ON public.alumni_profiles
  FOR ALL USING (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all alumni profiles" ON public.alumni_profiles
  FOR ALL USING (is_admin());

-- RLS Policies for alumni_credentials
CREATE POLICY "Alumni can view own credentials" ON public.alumni_credentials
  FOR SELECT USING (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all credentials" ON public.alumni_credentials
  FOR ALL USING (is_admin());

-- RLS Policies for alumni_events
CREATE POLICY "Alumni can view active events" ON public.alumni_events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all events" ON public.alumni_events
  FOR ALL USING (is_admin());

-- RLS Policies for alumni_event_registrations
CREATE POLICY "Alumni can view own registrations" ON public.alumni_event_registrations
  FOR SELECT USING (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Alumni can register for events" ON public.alumni_event_registrations
  FOR INSERT WITH CHECK (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Alumni can update own registrations" ON public.alumni_event_registrations
  FOR UPDATE USING (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all registrations" ON public.alumni_event_registrations
  FOR ALL USING (is_admin());

-- RLS Policies for alumni_mentorship
CREATE POLICY "Alumni can view mentorship where involved" ON public.alumni_mentorship
  FOR SELECT USING (
    mentor_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()) OR
    mentee_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Alumni can create mentorship requests" ON public.alumni_mentorship
  FOR INSERT WITH CHECK (
    mentor_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()) OR
    mentee_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Alumni can update mentorship where involved" ON public.alumni_mentorship
  FOR UPDATE USING (
    mentor_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()) OR
    mentee_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all mentorship" ON public.alumni_mentorship
  FOR ALL USING (is_admin());

-- RLS Policies for alumni_jobs
CREATE POLICY "Alumni can view active jobs" ON public.alumni_jobs
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > CURRENT_DATE));

CREATE POLICY "Alumni can create job postings" ON public.alumni_jobs
  FOR INSERT WITH CHECK (posted_by IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Alumni can update own job postings" ON public.alumni_jobs
  FOR UPDATE USING (posted_by IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all jobs" ON public.alumni_jobs
  FOR ALL USING (is_admin());

-- RLS Policies for alumni_donations
CREATE POLICY "Alumni can view own donations" ON public.alumni_donations
  FOR SELECT USING (donor_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Alumni can create donations" ON public.alumni_donations
  FOR INSERT WITH CHECK (donor_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all donations" ON public.alumni_donations
  FOR SELECT USING (is_admin());

-- RLS Policies for alumni_document_requests
CREATE POLICY "Alumni can view own document requests" ON public.alumni_document_requests
  FOR SELECT USING (requester_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Alumni can create document requests" ON public.alumni_document_requests
  FOR INSERT WITH CHECK (requester_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Alumni can update own document requests" ON public.alumni_document_requests
  FOR UPDATE USING (requester_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all document requests" ON public.alumni_document_requests
  FOR ALL USING (is_admin());

-- RLS Policies for alumni_chapters
CREATE POLICY "Alumni can view active chapters" ON public.alumni_chapters
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all chapters" ON public.alumni_chapters
  FOR ALL USING (is_admin());

-- RLS Policies for alumni_chapter_members
CREATE POLICY "Alumni can view chapter memberships" ON public.alumni_chapter_members
  FOR SELECT USING (true);

CREATE POLICY "Alumni can join chapters" ON public.alumni_chapter_members
  FOR INSERT WITH CHECK (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Alumni can update own memberships" ON public.alumni_chapter_members
  FOR UPDATE USING (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all memberships" ON public.alumni_chapter_members
  FOR ALL USING (is_admin());

-- RLS Policies for alumni_verification_requests
CREATE POLICY "Anyone can create verification requests" ON public.alumni_verification_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view own verification requests" ON public.alumni_verification_requests
  FOR SELECT USING (requester_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all verification requests" ON public.alumni_verification_requests
  FOR ALL USING (is_admin());

-- RLS Policies for alumni_support_tickets
CREATE POLICY "Alumni can view own support tickets" ON public.alumni_support_tickets
  FOR SELECT USING (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Alumni can create support tickets" ON public.alumni_support_tickets
  FOR INSERT WITH CHECK (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Alumni can update own support tickets" ON public.alumni_support_tickets
  FOR UPDATE USING (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all support tickets" ON public.alumni_support_tickets
  FOR ALL USING (is_admin());

-- Create indexes for better performance
CREATE INDEX idx_alumni_profiles_user_id ON public.alumni_profiles(user_id);
CREATE INDEX idx_alumni_profiles_graduation_year ON public.alumni_profiles(graduation_year);
CREATE INDEX idx_alumni_profiles_program ON public.alumni_profiles(program);
CREATE INDEX idx_alumni_credentials_user_id ON public.alumni_credentials(user_id);
CREATE INDEX idx_alumni_credentials_type ON public.alumni_credentials(credential_type);
CREATE INDEX idx_alumni_events_start_date ON public.alumni_events(start_date);
CREATE INDEX idx_alumni_events_type ON public.alumni_events(event_type);
CREATE INDEX idx_alumni_jobs_active ON public.alumni_jobs(is_active, expires_at);
CREATE INDEX idx_alumni_donations_donor ON public.alumni_donations(donor_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_alumni_profiles_updated_at
  BEFORE UPDATE ON public.alumni_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alumni_credentials_updated_at
  BEFORE UPDATE ON public.alumni_credentials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alumni_events_updated_at
  BEFORE UPDATE ON public.alumni_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alumni_mentorship_updated_at
  BEFORE UPDATE ON public.alumni_mentorship
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alumni_jobs_updated_at
  BEFORE UPDATE ON public.alumni_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alumni_donations_updated_at
  BEFORE UPDATE ON public.alumni_donations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alumni_document_requests_updated_at
  BEFORE UPDATE ON public.alumni_document_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alumni_chapters_updated_at
  BEFORE UPDATE ON public.alumni_chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alumni_verification_requests_updated_at
  BEFORE UPDATE ON public.alumni_verification_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alumni_support_tickets_updated_at
  BEFORE UPDATE ON public.alumni_support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();