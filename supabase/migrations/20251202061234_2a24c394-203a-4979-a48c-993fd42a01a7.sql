-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow TEXT NOT NULL CHECK (flow IN ('academic', 'non-academic')),
  type TEXT,
  topics JSONB,
  full_name TEXT NOT NULL,
  isd_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  message TEXT,
  captcha_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'spam')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for quick lookups
CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at);
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  submission_count INTEGER DEFAULT 1,
  captcha_fail_count INTEGER DEFAULT 0,
  blocked_until TIMESTAMPTZ,
  last_submission_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on ip_address
CREATE UNIQUE INDEX idx_contact_rate_limits_ip ON public.contact_rate_limits(ip_address);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- Admin can view all submissions
CREATE POLICY "Admins can view all contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

-- Anyone can insert (public form)
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Rate limit policies
CREATE POLICY "Service role can manage rate limits"
  ON public.contact_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);