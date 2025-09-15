-- Create agent profiles table
CREATE TABLE public.agent_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL UNIQUE,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  accreditation_certificate_url TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  total_earnings DECIMAL(12,2) DEFAULT 0.00,
  region TEXT,
  languages TEXT[],
  contact_info JSONB DEFAULT '{}',
  verification_documents JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses/programs table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT NOT NULL UNIQUE,
  course_name TEXT NOT NULL,
  degree_type TEXT NOT NULL CHECK (degree_type IN ('bachelor', 'master', 'phd', 'diploma', 'certificate')),
  college TEXT NOT NULL,
  department TEXT,
  duration_years INTEGER NOT NULL,
  credit_hours INTEGER,
  fee_structure JSONB DEFAULT '{}',
  eligibility_criteria TEXT,
  intake_months INTEGER[] DEFAULT ARRAY[1,9], -- January and September
  seat_capacity INTEGER DEFAULT 50,
  available_seats INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student applications table
CREATE TABLE public.student_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_number TEXT NOT NULL UNIQUE,
  agent_id UUID REFERENCES public.agent_profiles(id) ON DELETE CASCADE,
  student_id TEXT,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  nationality TEXT NOT NULL,
  passport_number TEXT,
  address TEXT NOT NULL,
  emergency_contact JSONB DEFAULT '{}',
  
  -- Academic Information
  course_id UUID REFERENCES public.courses(id),
  admission_year INTEGER NOT NULL,
  admission_month INTEGER NOT NULL DEFAULT 1,
  previous_education JSONB DEFAULT '[]',
  academic_documents JSONB DEFAULT '[]',
  
  -- Application Status
  status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'in_review', 'accepted', 'rejected', 'enrolled')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(user_id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Financial Information
  application_fee_paid BOOLEAN DEFAULT false,
  application_fee_amount DECIMAL(10,2),
  payment_reference TEXT,
  tuition_fee_paid BOOLEAN DEFAULT false,
  scholarship_applied BOOLEAN DEFAULT false,
  
  -- University Information
  university_id TEXT,
  admission_letter_url TEXT,
  enrollment_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student documents table
CREATE TABLE public.student_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.student_applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('passport', 'academic_transcript', 'diploma', 'recommendation_letter', 'personal_statement', 'language_certificate', 'financial_proof', 'medical_certificate', 'other')),
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES public.profiles(user_id),
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  ai_fraud_score DECIMAL(3,2), -- 0.00 to 1.00
  blockchain_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent commissions table
CREATE TABLE public.agent_commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agent_profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.student_applications(id) ON DELETE CASCADE,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('application', 'enrollment', 'retention')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  payment_reference TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent communications table
CREATE TABLE public.agent_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agent_profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.student_applications(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('chat', 'announcement', 'notification', 'document_request')),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('agent', 'admin', 'system')),
  sender_id UUID REFERENCES public.profiles(user_id),
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_communications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agent_profiles
CREATE POLICY "Agents can view and update their own profile" ON public.agent_profiles
  FOR ALL USING (user_id IN (SELECT profiles.user_id FROM profiles WHERE profiles.user_id = auth.uid()));

CREATE POLICY "Admins can manage all agent profiles" ON public.agent_profiles
  FOR ALL USING (is_admin());

-- RLS Policies for courses
CREATE POLICY "Anyone can view active courses" ON public.courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (is_admin());

-- RLS Policies for student_applications
CREATE POLICY "Agents can manage their own applications" ON public.student_applications
  FOR ALL USING (agent_id IN (SELECT ap.id FROM agent_profiles ap WHERE ap.user_id = auth.uid()));

CREATE POLICY "Admins can manage all applications" ON public.student_applications
  FOR ALL USING (is_admin());

-- RLS Policies for student_documents
CREATE POLICY "Agents can manage documents for their applications" ON public.student_documents
  FOR ALL USING (application_id IN (
    SELECT sa.id FROM student_applications sa 
    JOIN agent_profiles ap ON sa.agent_id = ap.id 
    WHERE ap.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all documents" ON public.student_documents
  FOR ALL USING (is_admin());

-- RLS Policies for agent_commissions
CREATE POLICY "Agents can view their own commissions" ON public.agent_commissions
  FOR SELECT USING (agent_id IN (SELECT ap.id FROM agent_profiles ap WHERE ap.user_id = auth.uid()));

CREATE POLICY "Admins can manage all commissions" ON public.agent_commissions
  FOR ALL USING (is_admin());

-- RLS Policies for agent_communications
CREATE POLICY "Agents can view their own communications" ON public.agent_communications
  FOR ALL USING (agent_id IN (SELECT ap.id FROM agent_profiles ap WHERE ap.user_id = auth.uid()));

CREATE POLICY "Admins can manage all communications" ON public.agent_communications
  FOR ALL USING (is_admin());

-- Create triggers for updated_at
CREATE TRIGGER update_agent_profiles_updated_at
  BEFORE UPDATE ON public.agent_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_applications_updated_at
  BEFORE UPDATE ON public.student_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_documents_updated_at
  BEFORE UPDATE ON public.student_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_commissions_updated_at
  BEFORE UPDATE ON public.agent_commissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample courses
INSERT INTO public.courses (course_code, course_name, degree_type, college, department, duration_years, credit_hours, eligibility_criteria, fee_structure) VALUES
('CS101', 'Bachelor of Computer Science', 'bachelor', 'College of Engineering', 'Computer Science', 4, 120, 'High school diploma with mathematics', '{"application_fee": 100, "tuition_per_year": 8000, "other_fees": 500}'),
('BA102', 'Bachelor of Business Administration', 'bachelor', 'School of Business', 'Business Administration', 4, 120, 'High school diploma', '{"application_fee": 100, "tuition_per_year": 7500, "other_fees": 500}'),
('ENG103', 'Bachelor of Engineering', 'bachelor', 'College of Engineering', 'General Engineering', 4, 128, 'High school diploma with physics and mathematics', '{"application_fee": 100, "tuition_per_year": 9000, "other_fees": 600}'),
('MED104', 'Bachelor of Medicine', 'bachelor', 'School of Medicine', 'Medicine', 6, 180, 'High school diploma with biology, chemistry, physics', '{"application_fee": 150, "tuition_per_year": 15000, "other_fees": 1000}'),
('MBA201', 'Master of Business Administration', 'master', 'School of Business', 'Business Administration', 2, 60, 'Bachelor degree in any field', '{"application_fee": 150, "tuition_per_year": 12000, "other_fees": 800}');

-- Generate application numbers function
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'APP' || to_char(now(), 'YYYY') || lpad((floor(random() * 999999) + 1)::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Set default application number
ALTER TABLE public.student_applications 
ALTER COLUMN application_number SET DEFAULT generate_application_number();