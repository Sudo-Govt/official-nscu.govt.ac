-- Add final chat and messaging tables

-- Add is_online to user_presence
ALTER TABLE public.user_presence
  ADD COLUMN IF NOT EXISTS is_online boolean DEFAULT false;

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid REFERENCES auth.users NOT NULL,
  recipient_id uuid REFERENCES auth.users NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON public.chat_messages FOR SELECT USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);
CREATE POLICY "Users can send messages" ON public.chat_messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update their received messages" ON public.chat_messages FOR UPDATE USING (recipient_id = auth.uid());

-- Create internal_messages table
CREATE TABLE IF NOT EXISTS public.internal_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid REFERENCES auth.users NOT NULL,
  recipient_id uuid REFERENCES auth.users NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  is_read boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.internal_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own internal messages" ON public.internal_messages FOR SELECT USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);
CREATE POLICY "Users can send internal messages" ON public.internal_messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update their received internal messages" ON public.internal_messages FOR UPDATE USING (recipient_id = auth.uid());