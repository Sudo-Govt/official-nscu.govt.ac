-- Add columns for fee approval and payment tracking
ALTER TABLE public.student_applications 
ADD COLUMN IF NOT EXISTS approved_fee numeric,
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_code text,
ADD COLUMN IF NOT EXISTS payment_completed_at timestamp with time zone;

-- Create index for payment code lookups
CREATE INDEX IF NOT EXISTS idx_student_applications_payment_code ON public.student_applications(payment_code);

-- Create function to generate unique payment code (ABC-000-000 format)
-- Excludes confusing characters: 0, 1, I, L, O
CREATE OR REPLACE FUNCTION generate_payment_code()
RETURNS text AS $$
DECLARE
  letters text := 'ABCDEFGHJKMNPQRSTUVWXYZ'; -- excludes I, L, O
  digits text := '23456789'; -- excludes 0, 1
  code text;
  letter_part text := '';
  digit_part text := '';
  i integer;
BEGIN
  -- Generate 3 random letters
  FOR i IN 1..3 LOOP
    letter_part := letter_part || substr(letters, floor(random() * length(letters) + 1)::int, 1);
  END LOOP;
  
  -- Generate 6 random digits
  FOR i IN 1..6 LOOP
    digit_part := digit_part || substr(digits, floor(random() * length(digits) + 1)::int, 1);
  END LOOP;
  
  -- Format as ABC-000-000
  code := letter_part || '-' || substr(digit_part, 1, 3) || '-' || substr(digit_part, 4, 3);
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;