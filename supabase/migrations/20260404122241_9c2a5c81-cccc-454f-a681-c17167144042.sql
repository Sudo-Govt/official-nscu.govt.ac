
CREATE TABLE public.book_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  book_slug TEXT NOT NULL DEFAULT 'what-school-never-taught-you',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.book_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert download leads"
  ON public.book_downloads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all downloads"
  ON public.book_downloads FOR SELECT
  USING (public.is_admin(auth.uid()));
