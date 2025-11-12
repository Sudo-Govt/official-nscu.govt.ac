-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  phone text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'student', 'faculty', 'admission_agent', 'finance', 'superadmin', 'alumni', 'staff', 'accounts', 'registrar', 'auditor', 'delegator')),
  created_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_code text UNIQUE NOT NULL,
  course_name text NOT NULL,
  degree_type text NOT NULL,
  college text NOT NULL,
  department text NOT NULL,
  duration_years integer NOT NULL,
  credit_hours integer NOT NULL,
  eligibility_criteria text,
  seat_capacity integer NOT NULL,
  available_seats integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Announcements table
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text NOT NULL,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  type text DEFAULT 'general' CHECK (type IN ('general', 'academic', 'event', 'emergency')),
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Academic calendar table
CREATE TABLE public.academic_calendar (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  event_type text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Documents table
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size bigint,
  is_public boolean DEFAULT false,
  target_audience text,
  target_user_id uuid REFERENCES auth.users,
  uploaded_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
  student_id text UNIQUE NOT NULL,
  enrollment_year integer NOT NULL,
  program text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Student applications table
CREATE TABLE public.student_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  program text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected', 'waitlisted')),
  application_data jsonb DEFAULT '{}'::jsonb,
  application_score numeric,
  scoring_breakdown jsonb,
  review_notes text,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Student documents table
CREATE TABLE public.student_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  application_id uuid REFERENCES student_applications(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  uploaded_at timestamptz DEFAULT now()
);

-- Agent messages table
CREATE TABLE public.agent_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id uuid REFERENCES student_applications(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Documents generated table
CREATE TABLE public.documents_generated (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_path text NOT NULL,
  generated_by uuid REFERENCES auth.users NOT NULL,
  generated_at timestamptz DEFAULT now()
);

-- Email accounts table
CREATE TABLE public.email_accounts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
  email_address text UNIQUE NOT NULL,
  encrypted_password text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Email messages table
CREATE TABLE public.email_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id uuid REFERENCES email_accounts(id) ON DELETE CASCADE,
  message_id text,
  from_address text NOT NULL,
  to_address text NOT NULL,
  subject text,
  body text,
  is_read boolean DEFAULT false,
  folder text DEFAULT 'inbox',
  received_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents_generated ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- RLS Policies for courses (public read)
CREATE POLICY "Anyone can view active courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- RLS Policies for announcements (public read)
CREATE POLICY "Anyone can view active announcements" ON public.announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- RLS Policies for academic_calendar (public read)
CREATE POLICY "Anyone can view academic calendar" ON public.academic_calendar FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage calendar" ON public.academic_calendar FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- RLS Policies for documents
CREATE POLICY "Users can view public documents" ON public.documents FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own documents" ON public.documents FOR SELECT USING (target_user_id = auth.uid());
CREATE POLICY "Admins can manage documents" ON public.documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- RLS Policies for students
CREATE POLICY "Students can view their own data" ON public.students FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage students" ON public.students FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin', 'faculty'))
);

-- RLS Policies for student_applications
CREATE POLICY "Users can view their own applications" ON public.student_applications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create applications" ON public.student_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage applications" ON public.student_applications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin', 'admission_agent'))
);

-- RLS Policies for student_documents
CREATE POLICY "Students can view their own documents" ON public.student_documents FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage student documents" ON public.student_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin', 'admission_agent'))
);

-- RLS Policies for agent_messages
CREATE POLICY "Users can view messages for their applications" ON public.agent_messages FOR SELECT USING (
  application_id IN (SELECT id FROM public.student_applications WHERE user_id = auth.uid())
  OR sender_id = auth.uid()
);
CREATE POLICY "Users can send messages" ON public.agent_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Admins can manage messages" ON public.agent_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin', 'admission_agent'))
);

-- RLS Policies for email_accounts
CREATE POLICY "Users can view their own email account" ON public.email_accounts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage email accounts" ON public.email_accounts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- RLS Policies for email_messages
CREATE POLICY "Users can view their own emails" ON public.email_messages FOR SELECT USING (
  account_id IN (SELECT id FROM public.email_accounts WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage their own emails" ON public.email_messages FOR ALL USING (
  account_id IN (SELECT id FROM public.email_accounts WHERE user_id = auth.uid())
);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.student_applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();