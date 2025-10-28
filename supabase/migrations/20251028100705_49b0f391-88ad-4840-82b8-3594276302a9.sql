-- Allow public/anonymous users to submit applications
CREATE POLICY "Public users can submit applications" ON public.student_applications
  FOR INSERT 
  WITH CHECK (true);

-- Add document upload columns to student_applications
ALTER TABLE public.student_applications
  ADD COLUMN IF NOT EXISTS photo_id_url TEXT,
  ADD COLUMN IF NOT EXISTS address_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS dob_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS citizenship_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS passport_url TEXT;

-- Ensure the student-documents bucket exists for storing application documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('application-documents', 'application-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Allow public users to upload their application documents
CREATE POLICY "Public users can upload application documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'application-documents');

-- Allow users to view their own application documents
CREATE POLICY "Users can view their own application documents"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'application-documents');

-- Allow admins to manage all application documents
CREATE POLICY "Admins can manage all application documents"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'application-documents' AND is_admin());