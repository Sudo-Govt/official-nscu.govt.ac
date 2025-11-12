-- Add final missing pieces

-- Add columns to alumni_document_requests
ALTER TABLE public.alumni_document_requests
  ADD COLUMN IF NOT EXISTS fee numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid';

-- Add columns to emails
ALTER TABLE public.emails
  ADD COLUMN IF NOT EXISTS has_attachments boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false;

-- Create email_folders table
CREATE TABLE IF NOT EXISTS public.email_folders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  unread_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.email_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own folders" ON public.email_folders FOR ALL USING (user_id = auth.uid());

-- Create email_attachments table
CREATE TABLE IF NOT EXISTS public.email_attachments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_id uuid REFERENCES emails(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.email_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments of their emails" ON public.email_attachments FOR SELECT USING (
  email_id IN (SELECT id FROM public.emails WHERE user_id = auth.uid())
);

-- Create user_presence table
CREATE TABLE IF NOT EXISTS public.user_presence (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users UNIQUE NOT NULL,
  status text DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away', 'busy')),
  last_seen timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all presence" ON public.user_presence FOR SELECT USING (true);
CREATE POLICY "Users can update their own presence" ON public.user_presence FOR ALL USING (user_id = auth.uid());

-- Add trigger for user_presence updated_at
CREATE TRIGGER update_user_presence_updated_at 
  BEFORE UPDATE ON public.user_presence 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();