-- Create email_accounts table to store user email credentials
CREATE TABLE IF NOT EXISTS public.email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_address TEXT NOT NULL UNIQUE,
  email_password TEXT NOT NULL, -- Encrypted password
  display_name TEXT NOT NULL,
  quota_mb INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  cpanel_account_created BOOLEAN DEFAULT false,
  UNIQUE(user_id)
);

-- Create email_folders table for organizing emails
CREATE TABLE IF NOT EXISTS public.email_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'custom', -- inbox, sent, drafts, trash, spam, starred, custom
  icon TEXT,
  color TEXT,
  parent_folder_id UUID REFERENCES public.email_folders(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, name, type)
);

-- Create email_labels table for Gmail-like labels
CREATE TABLE IF NOT EXISTS public.email_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#gray',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Drop and recreate emails table with enhanced structure
DROP TABLE IF EXISTS public.email_attachments CASCADE;
DROP TABLE IF EXISTS public.emails CASCADE;

CREATE TABLE public.emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_account_id UUID REFERENCES public.email_accounts(id) ON DELETE CASCADE,
  
  -- Email headers
  message_id TEXT, -- IMAP message ID
  thread_id UUID,
  in_reply_to UUID REFERENCES public.emails(id),
  
  -- From/To
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  to_name TEXT,
  cc TEXT,
  bcc TEXT,
  reply_to TEXT,
  
  -- Content
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  body_html TEXT,
  snippet TEXT, -- Preview text
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, received, failed
  email_type TEXT NOT NULL DEFAULT 'inbox', -- inbox, sent, drafts
  folder_id UUID REFERENCES public.email_folders(id),
  
  -- Flags
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  is_important BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  has_attachments BOOLEAN DEFAULT false,
  
  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  error_message TEXT,
  
  -- Search
  search_vector TSVECTOR
);

-- Create email_label_assignments for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.email_label_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID NOT NULL REFERENCES public.emails(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES public.email_labels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(email_id, label_id)
);

-- Recreate email_attachments table
CREATE TABLE public.email_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID NOT NULL REFERENCES public.emails(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_emails_user_id ON public.emails(user_id);
CREATE INDEX idx_emails_folder_id ON public.emails(folder_id);
CREATE INDEX idx_emails_email_type ON public.emails(email_type);
CREATE INDEX idx_emails_is_read ON public.emails(is_read);
CREATE INDEX idx_emails_is_starred ON public.emails(is_starred);
CREATE INDEX idx_emails_created_at ON public.emails(created_at DESC);
CREATE INDEX idx_emails_search_vector ON public.emails USING gin(search_vector);
CREATE INDEX idx_email_accounts_user_id ON public.email_accounts(user_id);
CREATE INDEX idx_email_folders_user_id ON public.email_folders(user_id);

-- Create full-text search trigger
CREATE OR REPLACE FUNCTION update_email_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.subject, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.body, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.from_email, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.to_email, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER emails_search_vector_update
BEFORE INSERT OR UPDATE ON public.emails
FOR EACH ROW EXECUTE FUNCTION update_email_search_vector();

-- RLS Policies for email_accounts
ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own email account"
ON public.email_accounts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all email accounts"
ON public.email_accounts FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- RLS Policies for emails
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emails"
ON public.emails FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emails"
ON public.emails FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emails"
ON public.emails FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own emails"
ON public.emails FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all emails"
ON public.emails FOR ALL
USING (is_admin());

-- RLS Policies for email_folders
ALTER TABLE public.email_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own folders"
ON public.email_folders FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for email_labels
ALTER TABLE public.email_labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own labels"
ON public.email_labels FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for email_label_assignments
ALTER TABLE public.email_label_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own label assignments"
ON public.email_label_assignments FOR ALL
USING (email_id IN (SELECT id FROM public.emails WHERE user_id = auth.uid()))
WITH CHECK (email_id IN (SELECT id FROM public.emails WHERE user_id = auth.uid()));

-- RLS Policies for email_attachments
ALTER TABLE public.email_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments for own emails"
ON public.email_attachments FOR SELECT
USING (email_id IN (SELECT id FROM public.emails WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert attachments for own emails"
ON public.email_attachments FOR INSERT
WITH CHECK (email_id IN (SELECT id FROM public.emails WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all attachments"
ON public.email_attachments FOR ALL
USING (is_admin());

-- Function to create default folders for new email account
CREATE OR REPLACE FUNCTION create_default_email_folders()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.email_folders (user_id, name, type, sort_order) VALUES
    (NEW.user_id, 'Inbox', 'inbox', 1),
    (NEW.user_id, 'Sent', 'sent', 2),
    (NEW.user_id, 'Drafts', 'drafts', 3),
    (NEW.user_id, 'Starred', 'starred', 4),
    (NEW.user_id, 'Trash', 'trash', 5),
    (NEW.user_id, 'Spam', 'spam', 6);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER create_default_folders_on_email_account
AFTER INSERT ON public.email_accounts
FOR EACH ROW EXECUTE FUNCTION create_default_email_folders();