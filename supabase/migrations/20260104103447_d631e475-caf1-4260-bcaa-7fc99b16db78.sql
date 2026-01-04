-- Insert test user metadata flag for payment gateway testing
-- This will be used to identify view-only test accounts

-- First, let's add a column to profiles to mark test accounts if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'is_test_account'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_test_account boolean DEFAULT false;
  END IF;
END $$;