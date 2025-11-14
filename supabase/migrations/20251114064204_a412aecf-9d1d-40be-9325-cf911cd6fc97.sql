-- Create table for affiliation requests
CREATE TABLE IF NOT EXISTS public.affiliation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  institution_type TEXT NOT NULL,
  expected_start_date TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliation_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create affiliation requests"
  ON public.affiliation_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all affiliation requests"
  ON public.affiliation_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can update affiliation requests"
  ON public.affiliation_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_affiliation_requests_updated_at
  BEFORE UPDATE ON public.affiliation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();