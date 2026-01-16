-- Create alumni_cta_buttons table for managing Quick Action buttons
CREATE TABLE public.alumni_cta_buttons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Network',
  description TEXT,
  action_type TEXT NOT NULL DEFAULT 'tab', -- 'tab', 'link', 'toast'
  action_value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_chat_room table for the global chat room
CREATE TABLE public.alumni_chat_room (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_private_messages table for direct messages
CREATE TABLE public.alumni_private_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_deleted_by_sender BOOLEAN NOT NULL DEFAULT false,
  is_deleted_by_recipient BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni_chat_presence table for online status
CREATE TABLE public.alumni_chat_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  is_online BOOLEAN NOT NULL DEFAULT true,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.alumni_cta_buttons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_chat_room ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_private_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_chat_presence ENABLE ROW LEVEL SECURITY;

-- CTA Buttons policies - anyone can read, only superadmin can modify
CREATE POLICY "Anyone can view active CTAs" 
ON public.alumni_cta_buttons 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Superadmins can manage CTAs" 
ON public.alumni_cta_buttons 
FOR ALL 
USING (public.has_role(auth.uid(), 'superadmin'))
WITH CHECK (public.has_role(auth.uid(), 'superadmin'));

-- Chat room policies - alumni and superadmin can read/write
CREATE POLICY "Alumni and admins can view chat messages" 
ON public.alumni_chat_room 
FOR SELECT 
TO authenticated
USING (is_deleted = false OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Alumni can send chat messages" 
ON public.alumni_chat_room 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND 
  (public.has_role(auth.uid(), 'alumni') OR public.has_role(auth.uid(), 'superadmin'))
);

CREATE POLICY "Superadmins can delete chat messages" 
ON public.alumni_chat_room 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'))
WITH CHECK (public.has_role(auth.uid(), 'superadmin'));

-- Private messages policies
CREATE POLICY "Users can view their own private messages" 
ON public.alumni_private_messages 
FOR SELECT 
TO authenticated
USING (
  (sender_id = auth.uid() AND is_deleted_by_sender = false) OR 
  (recipient_id = auth.uid() AND is_deleted_by_recipient = false) OR
  public.has_role(auth.uid(), 'superadmin')
);

CREATE POLICY "Users can send private messages" 
ON public.alumni_private_messages 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = sender_id AND 
  (public.has_role(auth.uid(), 'alumni') OR public.has_role(auth.uid(), 'superadmin'))
);

CREATE POLICY "Users can update their own messages" 
ON public.alumni_private_messages 
FOR UPDATE 
TO authenticated
USING (
  sender_id = auth.uid() OR 
  recipient_id = auth.uid() OR 
  public.has_role(auth.uid(), 'superadmin')
);

-- Presence policies
CREATE POLICY "Anyone authenticated can view presence" 
ON public.alumni_chat_presence 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can update their own presence" 
ON public.alumni_chat_presence 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update presence" 
ON public.alumni_chat_presence 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'superadmin'));

-- Add triggers for updated_at
CREATE TRIGGER update_alumni_cta_buttons_updated_at
BEFORE UPDATE ON public.alumni_cta_buttons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_alumni_chat_room_created_at ON public.alumni_chat_room(created_at DESC);
CREATE INDEX idx_alumni_chat_room_user_id ON public.alumni_chat_room(user_id);
CREATE INDEX idx_alumni_private_messages_sender ON public.alumni_private_messages(sender_id);
CREATE INDEX idx_alumni_private_messages_recipient ON public.alumni_private_messages(recipient_id);
CREATE INDEX idx_alumni_chat_presence_user_id ON public.alumni_chat_presence(user_id);

-- Enable realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.alumni_chat_room;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alumni_private_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alumni_chat_presence;

-- Insert default CTA buttons
INSERT INTO public.alumni_cta_buttons (title, icon, description, action_type, action_value, sort_order) VALUES
('Alumni Directory', 'Network', 'Connect with fellow alumni', 'tab', 'networking', 1),
('Make a Donation', 'Heart', 'Support your alma mater', 'toast', 'donation', 2),
('Career Center', 'Briefcase', 'Career services and opportunities', 'tab', 'career', 3),
('Documents', 'FileText', 'Request transcripts and certificates', 'tab', 'documents', 4),
('Chat Room', 'MessageCircle', 'Join the alumni chat room', 'tab', 'chatroom', 5);