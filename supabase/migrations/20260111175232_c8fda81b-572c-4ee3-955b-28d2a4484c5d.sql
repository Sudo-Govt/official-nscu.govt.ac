-- Add new columns to emails table for Gmail-like features
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS thread_id uuid;
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal';
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS labels jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS scheduled_at timestamp with time zone;
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS reply_to_id uuid REFERENCES public.emails(id);
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS cc text;
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS bcc text;

-- Create email_labels table for custom user labels
CREATE TABLE IF NOT EXISTS public.email_labels (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3b82f6',
  icon text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create email_signatures table
CREATE TABLE IF NOT EXISTS public.email_signatures (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  content text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create email_templates table for admin templates
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  category text DEFAULT 'general',
  is_system boolean DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.email_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_labels
CREATE POLICY "Users can view their own labels" ON public.email_labels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own labels" ON public.email_labels
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own labels" ON public.email_labels
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own labels" ON public.email_labels
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for email_signatures
CREATE POLICY "Users can view their own signatures" ON public.email_signatures
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own signatures" ON public.email_signatures
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own signatures" ON public.email_signatures
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own signatures" ON public.email_signatures
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for email_templates
CREATE POLICY "Anyone can view email templates" ON public.email_templates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage email templates" ON public.email_templates
  FOR ALL USING (public.is_admin(auth.uid()));

-- Enable realtime for emails
ALTER PUBLICATION supabase_realtime ADD TABLE public.emails;