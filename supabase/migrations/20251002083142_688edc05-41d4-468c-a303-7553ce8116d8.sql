-- Modify student_payments to support both applications and enrolled students
-- First, make student_id nullable so we can use application_id instead
ALTER TABLE student_payments 
  ALTER COLUMN student_id DROP NOT NULL;

-- Add application_id column to link payments to applications
ALTER TABLE student_payments
  ADD COLUMN application_id UUID REFERENCES student_applications(id) ON DELETE CASCADE;

-- Add constraint to ensure either student_id or application_id is set
ALTER TABLE student_payments
  ADD CONSTRAINT student_payments_ref_check 
  CHECK (
    (student_id IS NOT NULL AND application_id IS NULL) OR
    (student_id IS NULL AND application_id IS NOT NULL)
  );

-- Create index for application_id
CREATE INDEX IF NOT EXISTS idx_student_payments_application_id 
  ON student_payments(application_id);