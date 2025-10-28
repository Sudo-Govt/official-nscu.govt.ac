-- Security Fix: Encrypt email passwords and add PII protections
-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create audit logging table for profile access
CREATE TABLE IF NOT EXISTS public.profile_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accessed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  accessed_profile UUID,
  fields_accessed TEXT[],
  access_type TEXT NOT NULL,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on audit logs
ALTER TABLE public.profile_access_logs ENABLE ROW LEVEL SECURITY;

-- Only superadmins can view audit logs
CREATE POLICY "Superadmins can view all audit logs"
ON public.profile_access_logs
FOR SELECT
USING (is_superadmin());

-- Create masked profiles view for non-critical admin operations
CREATE OR REPLACE VIEW public.profiles_masked AS
SELECT 
  user_id,
  full_name,
  role,
  department,
  CASE 
    WHEN phone IS NOT NULL THEN 
      CONCAT(SUBSTRING(phone, 1, 3), '***', SUBSTRING(phone FROM LENGTH(phone) - 1))
    ELSE NULL
  END as phone_masked,
  CASE 
    WHEN address IS NOT NULL THEN
      CONCAT(SUBSTRING(address, 1, 10), '...')
    ELSE NULL
  END as address_masked,
  date_of_birth IS NOT NULL as has_dob,
  emergency_contact IS NOT NULL as has_emergency_contact,
  avatar_url,
  bio,
  enrollment_year,
  graduation_year,
  status,
  created_at,
  updated_at
FROM public.profiles;

-- Add encrypted password column to email_accounts
ALTER TABLE public.email_accounts 
ADD COLUMN IF NOT EXISTS email_password_encrypted BYTEA;

-- Create secure function to encrypt passwords
CREATE OR REPLACE FUNCTION public.encrypt_email_password(
  account_id UUID,
  plain_password TEXT,
  encryption_key TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.email_accounts
  SET email_password_encrypted = pgp_sym_encrypt(plain_password, encryption_key)
  WHERE id = account_id;
  
  RETURN FOUND;
END;
$$;

-- Create secure function to decrypt passwords (only for authorized use)
CREATE OR REPLACE FUNCTION public.decrypt_email_password(
  account_id UUID,
  encryption_key TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encrypted_pwd BYTEA;
  decrypted_pwd TEXT;
BEGIN
  -- Only superadmins or account owners can decrypt
  IF NOT (is_superadmin() OR EXISTS (
    SELECT 1 FROM public.email_accounts 
    WHERE id = account_id AND user_id = auth.uid()
  )) THEN
    RAISE EXCEPTION 'Unauthorized access to decrypt email password';
  END IF;
  
  SELECT email_password_encrypted INTO encrypted_pwd
  FROM public.email_accounts
  WHERE id = account_id;
  
  IF encrypted_pwd IS NULL THEN
    RETURN NULL;
  END IF;
  
  decrypted_pwd := pgp_sym_decrypt(encrypted_pwd, encryption_key);
  
  RETURN decrypted_pwd;
END;
$$;

-- Migrate existing plain text passwords to encrypted format
-- Note: This uses a default key - users should rotate passwords after changing the key
DO $$
DECLARE
  default_key TEXT := 'TEMP_KEY_ROTATE_IMMEDIATELY_' || gen_random_uuid()::text;
BEGIN
  UPDATE public.email_accounts
  SET email_password_encrypted = pgp_sym_encrypt(email_password, default_key)
  WHERE email_password IS NOT NULL 
    AND email_password_encrypted IS NULL;
END $$;

-- Add comments for documentation
COMMENT ON FUNCTION public.encrypt_email_password IS 'Encrypts email password using pgcrypto. Requires secure encryption key.';
COMMENT ON FUNCTION public.decrypt_email_password IS 'Decrypts email password. Only accessible by superadmins and account owners.';
COMMENT ON TABLE public.profile_access_logs IS 'Audit log for tracking access to sensitive profile data';
COMMENT ON VIEW public.profiles_masked IS 'Masked view of profiles for non-critical admin operations. Use this instead of direct profiles access when full PII is not needed.';