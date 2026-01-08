-- Create enum for form status
CREATE TYPE public.form_status AS ENUM ('draft', 'published', 'archived');

-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM ('draft', 'pending', 'in_review', 'approved', 'rejected', 'requires_action', 'cancelled');

-- Create enum for form category
CREATE TYPE public.form_category AS ENUM (
  'admission',
  'partnership',
  'visitor',
  'inquiry',
  'academic',
  'student_services',
  'financial',
  'hostel',
  'library',
  'facilities',
  'events',
  'lost_found',
  'health_safety',
  'complaints',
  'hr'
);

-- Create enum for form access level
CREATE TYPE public.form_access_level AS ENUM ('public', 'student', 'faculty', 'staff', 'admin', 'all_authenticated');

-- Forms template table
CREATE TABLE public.form_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category public.form_category NOT NULL,
  access_level public.form_access_level NOT NULL DEFAULT 'public',
  status public.form_status NOT NULL DEFAULT 'draft',
  fields JSONB NOT NULL DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  required_documents TEXT[],
  estimated_time TEXT,
  icon TEXT DEFAULT 'file-text',
  sort_order INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Form submissions table
CREATE TABLE public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES public.form_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  tracking_number TEXT UNIQUE NOT NULL,
  status public.submission_status NOT NULL DEFAULT 'pending',
  form_data JSONB NOT NULL DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  submitted_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Submission comments/messages table
CREATE TABLE public.form_submission_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.form_submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create function to generate tracking number
CREATE OR REPLACE FUNCTION public.generate_tracking_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.tracking_number IS NULL THEN
    NEW.tracking_number := 'FRM-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
      UPPER(SUBSTRING(NEW.id::TEXT, 1, 8));
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for tracking number
CREATE TRIGGER set_tracking_number
  BEFORE INSERT ON public.form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_tracking_number();

-- Create trigger for updated_at
CREATE TRIGGER update_form_templates_updated_at
  BEFORE UPDATE ON public.form_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_form_submissions_updated_at
  BEFORE UPDATE ON public.form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submission_comments ENABLE ROW LEVEL SECURITY;

-- Form templates policies (public can view published forms)
CREATE POLICY "Anyone can view published forms"
  ON public.form_templates FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage all forms"
  ON public.form_templates FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Form submissions policies
CREATE POLICY "Users can view their own submissions"
  ON public.form_submissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can create submissions"
  ON public.form_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own draft submissions"
  ON public.form_submissions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status = 'draft');

CREATE POLICY "Admins can manage all submissions"
  ON public.form_submissions FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Comments policies
CREATE POLICY "Users can view non-internal comments on their submissions"
  ON public.form_submission_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.form_submissions fs 
      WHERE fs.id = submission_id 
      AND (fs.user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
    AND (NOT is_internal OR public.is_admin(auth.uid()))
  );

CREATE POLICY "Users can add comments to their submissions"
  ON public.form_submission_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.form_submissions fs 
      WHERE fs.id = submission_id 
      AND (fs.user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

-- Create storage bucket for form attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('form-attachments', 'form-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for form attachments
CREATE POLICY "Authenticated users can upload form attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'form-attachments');

CREATE POLICY "Users can view their own attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'form-attachments' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin(auth.uid()))
  );

-- Insert initial form templates
INSERT INTO public.form_templates (title, slug, description, category, access_level, status, icon, is_popular, estimated_time, fields) VALUES
-- Public Admission Forms
('Undergraduate Admission Application', 'undergraduate-admission', 'Apply for undergraduate programs at NSCU', 'admission', 'public', 'published', 'graduation-cap', true, '30-45 minutes', 
'[{"name": "personal_info", "type": "section", "label": "Personal Information", "fields": [
  {"name": "full_name", "type": "text", "label": "Full Name", "required": true},
  {"name": "email", "type": "email", "label": "Email Address", "required": true},
  {"name": "phone", "type": "tel", "label": "Phone Number", "required": true},
  {"name": "date_of_birth", "type": "date", "label": "Date of Birth", "required": true},
  {"name": "nationality", "type": "text", "label": "Nationality", "required": true}
]},
{"name": "academic_info", "type": "section", "label": "Academic Background", "fields": [
  {"name": "high_school", "type": "text", "label": "High School Name", "required": true},
  {"name": "graduation_year", "type": "number", "label": "Year of Graduation", "required": true},
  {"name": "gpa", "type": "number", "label": "GPA", "required": true},
  {"name": "program_interest", "type": "select", "label": "Program of Interest", "required": true, "options": ["Computer Science", "Business Administration", "Engineering", "Medicine", "Arts"]}
]}]'),

('Graduate Admission Application', 'graduate-admission', 'Apply for graduate and postgraduate programs', 'admission', 'public', 'published', 'book-open', true, '45-60 minutes', 
'[{"name": "personal", "type": "section", "label": "Personal Details", "fields": [
  {"name": "full_name", "type": "text", "label": "Full Name", "required": true},
  {"name": "email", "type": "email", "label": "Email", "required": true},
  {"name": "phone", "type": "tel", "label": "Phone", "required": true}
]},
{"name": "academic", "type": "section", "label": "Academic Background", "fields": [
  {"name": "bachelor_degree", "type": "text", "label": "Bachelor''s Degree", "required": true},
  {"name": "university", "type": "text", "label": "University", "required": true},
  {"name": "gpa", "type": "number", "label": "GPA", "required": true},
  {"name": "research_interest", "type": "textarea", "label": "Research Interests", "required": true}
]}]'),

('International Student Application', 'international-admission', 'Application for international students', 'admission', 'public', 'published', 'globe', false, '45 minutes', 
'[{"name": "personal", "type": "section", "label": "Personal Information", "fields": [
  {"name": "full_name", "type": "text", "label": "Full Name", "required": true},
  {"name": "email", "type": "email", "label": "Email", "required": true},
  {"name": "country", "type": "text", "label": "Country of Origin", "required": true},
  {"name": "passport_number", "type": "text", "label": "Passport Number", "required": true}
]}]'),

('Agent Recruitment Application', 'agent-recruitment', 'Apply to become an official NSCU recruitment agent', 'partnership', 'public', 'published', 'users', false, '20 minutes', 
'[{"name": "agency", "type": "section", "label": "Agency Details", "fields": [
  {"name": "agency_name", "type": "text", "label": "Agency Name", "required": true},
  {"name": "contact_person", "type": "text", "label": "Contact Person", "required": true},
  {"name": "email", "type": "email", "label": "Email", "required": true},
  {"name": "phone", "type": "tel", "label": "Phone", "required": true},
  {"name": "country", "type": "text", "label": "Country", "required": true},
  {"name": "experience_years", "type": "number", "label": "Years of Experience", "required": true}
]}]'),

('Campus Tour Request', 'campus-tour', 'Schedule a campus tour visit', 'visitor', 'public', 'published', 'map-pin', true, '5 minutes', 
'[{"name": "visitor", "type": "section", "label": "Visitor Information", "fields": [
  {"name": "name", "type": "text", "label": "Full Name", "required": true},
  {"name": "email", "type": "email", "label": "Email", "required": true},
  {"name": "phone", "type": "tel", "label": "Phone", "required": true},
  {"name": "preferred_date", "type": "date", "label": "Preferred Date", "required": true},
  {"name": "group_size", "type": "number", "label": "Group Size", "required": true},
  {"name": "areas_of_interest", "type": "checkbox", "label": "Areas of Interest", "options": ["Campus Facilities", "Academic Buildings", "Student Housing", "Sports Complex", "Library"]}
]}]'),

('General Inquiry', 'general-inquiry', 'Submit a general question or inquiry', 'inquiry', 'public', 'published', 'help-circle', false, '5 minutes', 
'[{"name": "inquiry", "type": "section", "label": "Your Inquiry", "fields": [
  {"name": "name", "type": "text", "label": "Name", "required": true},
  {"name": "email", "type": "email", "label": "Email", "required": true},
  {"name": "subject", "type": "text", "label": "Subject", "required": true},
  {"name": "message", "type": "textarea", "label": "Message", "required": true}
]}]'),

-- Student Dashboard Forms
('Transcript Request', 'transcript-request', 'Request official academic transcripts', 'academic', 'student', 'published', 'file-text', true, '5 minutes',
'[{"name": "request", "type": "section", "label": "Request Details", "fields": [
  {"name": "copies", "type": "number", "label": "Number of Copies", "required": true},
  {"name": "purpose", "type": "select", "label": "Purpose", "required": true, "options": ["Employment", "Further Education", "Immigration", "Personal"]},
  {"name": "delivery_method", "type": "select", "label": "Delivery Method", "required": true, "options": ["Pick Up", "Mail", "Digital"]},
  {"name": "urgent", "type": "checkbox", "label": "Urgent (Additional Fee)"}
]}]'),

('Course Registration', 'course-registration', 'Register for courses for the upcoming semester', 'academic', 'student', 'published', 'book', true, '15 minutes',
'[{"name": "registration", "type": "section", "label": "Course Selection", "fields": [
  {"name": "semester", "type": "select", "label": "Semester", "required": true, "options": ["Fall 2026", "Spring 2027", "Summer 2027"]},
  {"name": "courses", "type": "textarea", "label": "Course Codes (one per line)", "required": true}
]}]'),

('ID Card Replacement', 'id-card-replacement', 'Request a replacement student ID card', 'student_services', 'student', 'published', 'credit-card', true, '5 minutes',
'[{"name": "request", "type": "section", "label": "Request Details", "fields": [
  {"name": "reason", "type": "select", "label": "Reason for Replacement", "required": true, "options": ["Lost", "Stolen", "Damaged", "Name Change"]},
  {"name": "police_report", "type": "text", "label": "Police Report Number (if stolen)"}
]}]'),

('Leave Application', 'leave-application', 'Apply for academic leave of absence', 'student_services', 'student', 'published', 'calendar', true, '10 minutes',
'[{"name": "leave", "type": "section", "label": "Leave Details", "fields": [
  {"name": "leave_type", "type": "select", "label": "Type of Leave", "required": true, "options": ["Medical", "Personal", "Family Emergency", "Other"]},
  {"name": "start_date", "type": "date", "label": "Start Date", "required": true},
  {"name": "end_date", "type": "date", "label": "End Date", "required": true},
  {"name": "reason", "type": "textarea", "label": "Reason", "required": true}
]}]'),

('Hostel Application', 'hostel-application', 'Apply for on-campus housing', 'hostel', 'student', 'published', 'home', true, '15 minutes',
'[{"name": "hostel", "type": "section", "label": "Housing Preferences", "fields": [
  {"name": "room_type", "type": "select", "label": "Room Type", "required": true, "options": ["Single", "Double", "Triple"]},
  {"name": "meal_plan", "type": "select", "label": "Meal Plan", "required": true, "options": ["Full Board", "Breakfast Only", "No Meals"]},
  {"name": "special_requirements", "type": "textarea", "label": "Special Requirements"}
]}]'),

('Fee Waiver Application', 'fee-waiver', 'Apply for fee waiver or scholarship', 'financial', 'student', 'published', 'dollar-sign', false, '20 minutes',
'[{"name": "financial", "type": "section", "label": "Financial Information", "fields": [
  {"name": "annual_income", "type": "number", "label": "Annual Family Income (USD)", "required": true},
  {"name": "dependents", "type": "number", "label": "Number of Dependents", "required": true},
  {"name": "reason", "type": "textarea", "label": "Reason for Application", "required": true}
]}]');

-- Create indexes for performance
CREATE INDEX idx_form_templates_category ON public.form_templates(category);
CREATE INDEX idx_form_templates_status ON public.form_templates(status);
CREATE INDEX idx_form_templates_access_level ON public.form_templates(access_level);
CREATE INDEX idx_form_submissions_user_id ON public.form_submissions(user_id);
CREATE INDEX idx_form_submissions_status ON public.form_submissions(status);
CREATE INDEX idx_form_submissions_tracking ON public.form_submissions(tracking_number);