
-- Student Results table
CREATE TABLE IF NOT EXISTS public.student_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  enrollment_number TEXT NOT NULL,
  grade_level TEXT,
  examination TEXT NOT NULL,
  session TEXT NOT NULL,
  total_marks TEXT,
  percentage TEXT,
  school_name TEXT,
  result_html TEXT,
  marksheet_html TEXT,
  certificate_id TEXT,
  certificate_hash TEXT,
  marksheet_data_snapshot JSONB,
  marksheet_generated_at TIMESTAMPTZ,
  portfolio_secret TEXT,
  result_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.student_results ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins manage student results"
ON public.student_results FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Public read for result verification (anyone with the ID can view)
CREATE POLICY "Public read student results"
ON public.student_results FOR SELECT
TO anon
USING (true);

CREATE POLICY "Authenticated read student results"
ON public.student_results FOR SELECT
TO authenticated
USING (true);

-- QR Codes table
CREATE TABLE IF NOT EXISTS public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_result_id UUID REFERENCES public.student_results(id) ON DELETE CASCADE NOT NULL,
  qr_url TEXT NOT NULL,
  qr_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage QR codes"
ON public.qr_codes FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read QR codes"
ON public.qr_codes FOR SELECT
TO anon
USING (true);

CREATE POLICY "Authenticated read QR codes"
ON public.qr_codes FOR SELECT
TO authenticated
USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_student_results_updated_at
  BEFORE UPDATE ON public.student_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
