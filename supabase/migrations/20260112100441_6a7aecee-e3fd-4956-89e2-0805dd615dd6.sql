-- Enhanced Internal Messaging System for Closed Institutional Platform
-- Drop any existing tables that need to be recreated
DROP TABLE IF EXISTS public.internal_message_attachments CASCADE;

-- Add columns to internal_messages if they don't exist
ALTER TABLE public.internal_messages 
ADD COLUMN IF NOT EXISTS thread_id uuid,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS is_draft boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
ADD COLUMN IF NOT EXISTS folder text DEFAULT 'inbox',
ADD COLUMN IF NOT EXISTS labels jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS cc text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS bcc text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS reply_to_id uuid REFERENCES public.internal_messages(id),
ADD COLUMN IF NOT EXISTS document_references jsonb DEFAULT '[]'::jsonb;

-- Create index for thread_id
CREATE INDEX IF NOT EXISTS idx_internal_messages_thread_id ON public.internal_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_internal_messages_folder ON public.internal_messages(folder);

-- Internal message attachments (for system documents)
CREATE TABLE IF NOT EXISTS public.internal_message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.internal_messages(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  file_type text,
  is_system_document boolean DEFAULT false,
  document_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create user_identities table for internal IDs like name@department
CREATE TABLE IF NOT EXISTS public.user_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  internal_id text NOT NULL UNIQUE,
  display_name text,
  department text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_channels for group chats
CREATE TABLE IF NOT EXISTS public.chat_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  channel_type text DEFAULT 'public' CHECK (channel_type IN ('public', 'private', 'direct')),
  created_by uuid,
  members uuid[] DEFAULT '{}',
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create channel_messages for group chat messages
CREATE TABLE IF NOT EXISTS public.channel_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  message text NOT NULL,
  reply_to_id uuid REFERENCES public.channel_messages(id),
  reactions jsonb DEFAULT '{}'::jsonb,
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  document_references jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create internal_labels table
CREATE TABLE IF NOT EXISTS public.internal_labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.internal_message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_labels ENABLE ROW LEVEL SECURITY;

-- RLS policies for internal_message_attachments
CREATE POLICY "Users can view attachments of their messages"
ON public.internal_message_attachments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.internal_messages im
    WHERE im.id = message_id
    AND (im.sender_id = auth.uid() OR im.recipient_id = auth.uid())
  )
);

CREATE POLICY "Users can insert attachments"
ON public.internal_message_attachments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.internal_messages im
    WHERE im.id = message_id AND im.sender_id = auth.uid()
  )
);

-- RLS policies for user_identities
CREATE POLICY "Users can view all identities"
ON public.user_identities FOR SELECT
USING (true);

CREATE POLICY "Users can update own identity"
ON public.user_identities FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own identity"
ON public.user_identities FOR INSERT
WITH CHECK (user_id = auth.uid());

-- RLS policies for chat_channels
CREATE POLICY "Users can view public and member channels"
ON public.chat_channels FOR SELECT
USING (
  channel_type = 'public' OR 
  auth.uid() = ANY(members) OR
  created_by = auth.uid()
);

CREATE POLICY "Users can create channels"
ON public.chat_channels FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Channel creators can update"
ON public.chat_channels FOR UPDATE
USING (created_by = auth.uid() OR auth.uid() = ANY(members));

-- RLS policies for channel_messages
CREATE POLICY "Users can view messages in their channels"
ON public.channel_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_channels c
    WHERE c.id = channel_id
    AND (c.channel_type = 'public' OR auth.uid() = ANY(c.members) OR c.created_by = auth.uid())
  )
);

CREATE POLICY "Users can send messages to their channels"
ON public.channel_messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.chat_channels c
    WHERE c.id = channel_id
    AND (c.channel_type = 'public' OR auth.uid() = ANY(c.members) OR c.created_by = auth.uid())
  )
);

CREATE POLICY "Users can update own messages"
ON public.channel_messages FOR UPDATE
USING (sender_id = auth.uid());

-- RLS policies for internal_labels
CREATE POLICY "Users can manage own labels"
ON public.internal_labels FOR ALL
USING (user_id = auth.uid());

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.channel_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Create function to generate internal_id
CREATE OR REPLACE FUNCTION public.generate_internal_id()
RETURNS TRIGGER AS $$
DECLARE
  user_name text;
  user_role text;
  dept text;
BEGIN
  -- Get user info
  SELECT 
    LOWER(REPLACE(SPLIT_PART(full_name, ' ', 1), '''', '')),
    COALESCE(role, 'user')
  INTO user_name, user_role
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  
  -- Determine department based on role
  dept := CASE 
    WHEN user_role IN ('superadmin', 'admin', 'platform_admin') THEN 'admin'
    WHEN user_role = 'student' THEN 'students'
    WHEN user_role = 'faculty' THEN 'faculty'
    WHEN user_role = 'alumni' THEN 'alumni'
    WHEN user_role IN ('admission_admin', 'admission_staff', 'admission_agent') THEN 'admissions'
    WHEN user_role = 'finance' THEN 'finance'
    WHEN user_role = 'hr_admin' THEN 'hr'
    ELSE 'staff'
  END;
  
  NEW.internal_id := user_name || '@' || dept;
  NEW.department := dept;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE TRIGGER trigger_generate_internal_id
BEFORE INSERT ON public.user_identities
FOR EACH ROW
WHEN (NEW.internal_id IS NULL)
EXECUTE FUNCTION public.generate_internal_id();

-- Create storage bucket for internal attachments if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('internal-attachments', 'internal-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for internal attachments
CREATE POLICY "Users can upload internal attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'internal-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view internal attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'internal-attachments');

CREATE POLICY "Users can delete own internal attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'internal-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);