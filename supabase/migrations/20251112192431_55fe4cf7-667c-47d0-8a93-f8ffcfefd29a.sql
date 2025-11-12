-- Add missing columns to existing tables

-- Add columns to student_applications
ALTER TABLE public.student_applications 
  ADD COLUMN application_number text UNIQUE,
  ADD COLUMN first_name text,
  ADD COLUMN last_name text,
  ADD COLUMN nationality text,
  ADD COLUMN course_id uuid REFERENCES courses(id);

-- Add columns to students table
ALTER TABLE public.students
  ADD COLUMN name text,
  ADD COLUMN father_name text,
  ADD COLUMN mother_name text,
  ADD COLUMN dob date,
  ADD COLUMN nationality text,
  ADD COLUMN address text,
  ADD COLUMN city text,
  ADD COLUMN state text,
  ADD COLUMN pincode text;

-- Add columns to documents table
ALTER TABLE public.documents
  ADD COLUMN file_name text,
  ADD COLUMN category text;

-- Add columns to student_documents table  
ALTER TABLE public.student_documents
  ADD COLUMN document_name text,
  ADD COLUMN mime_type text,
  ADD COLUMN is_verified boolean DEFAULT false,
  ADD COLUMN created_at timestamptz DEFAULT now();

-- Add columns to documents_generated table
ALTER TABLE public.documents_generated
  ADD COLUMN doc_type text,
  ADD COLUMN json_content jsonb,
  ADD COLUMN created_at timestamptz DEFAULT now();

-- Add role column to profiles (for backward compatibility)
ALTER TABLE public.profiles
  ADD COLUMN role text;

-- Generate application numbers for existing applications
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_number IS NULL THEN
    NEW.application_number := 'APP' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('application_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for application numbers
CREATE SEQUENCE IF NOT EXISTS application_seq START 1;

-- Add trigger for auto-generating application numbers
CREATE TRIGGER set_application_number
  BEFORE INSERT ON public.student_applications
  FOR EACH ROW
  EXECUTE FUNCTION generate_application_number();