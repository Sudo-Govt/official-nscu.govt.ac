-- Create emails table
CREATE TABLE IF NOT EXISTS public.emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_email text NOT NULL,
  from_name text,
  to_email text NOT NULL,
  to_name text,
  cc text,
  bcc text,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft', -- draft, sent, failed, received
  email_type text NOT NULL DEFAULT 'sent', -- sent, received, draft
  is_read boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  thread_id uuid,
  in_reply_to uuid REFERENCES public.emails(id),
  sent_at timestamp with time zone,
  received_at timestamp with time zone,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create email attachments table
CREATE TABLE IF NOT EXISTS public.email_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid REFERENCES public.emails(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  mime_type text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for emails
CREATE POLICY "Users can view their own emails"
ON public.emails FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own emails"
ON public.emails FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own emails"
ON public.emails FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own emails"
ON public.emails FOR DELETE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all emails"
ON public.emails FOR ALL
TO authenticated
USING (is_admin());

-- RLS Policies for attachments
CREATE POLICY "Users can view attachments for their emails"
ON public.email_attachments FOR SELECT
TO authenticated
USING (email_id IN (SELECT id FROM public.emails WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert attachments for their emails"
ON public.email_attachments FOR INSERT
TO authenticated
WITH CHECK (email_id IN (SELECT id FROM public.emails WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all attachments"
ON public.email_attachments FOR ALL
TO authenticated
USING (is_admin());

-- Create indexes
CREATE INDEX idx_emails_user_id ON public.emails(user_id);
CREATE INDEX idx_emails_status ON public.emails(status);
CREATE INDEX idx_emails_email_type ON public.emails(email_type);
CREATE INDEX idx_emails_thread_id ON public.emails(thread_id);
CREATE INDEX idx_email_attachments_email_id ON public.email_attachments(email_id);

-- Create trigger for updated_at
CREATE TRIGGER update_emails_updated_at
BEFORE UPDATE ON public.emails
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();