-- Create SMTP settings table
CREATE TABLE IF NOT EXISTS public.smtp_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  smtp_host text NOT NULL,
  smtp_port integer NOT NULL DEFAULT 587,
  smtp_user text NOT NULL,
  smtp_password text NOT NULL,
  from_email text NOT NULL,
  from_name text NOT NULL,
  use_tls boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage SMTP settings
CREATE POLICY "Admins can manage SMTP settings"
ON public.smtp_settings
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_smtp_settings_updated_at
BEFORE UPDATE ON public.smtp_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();