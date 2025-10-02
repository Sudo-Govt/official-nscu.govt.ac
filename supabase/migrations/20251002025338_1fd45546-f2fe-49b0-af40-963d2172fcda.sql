-- Create internal messages table
CREATE TABLE IF NOT EXISTS internal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  is_deleted_by_sender BOOLEAN DEFAULT false,
  is_deleted_by_recipient BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create user presence table for tracking online status
CREATE TABLE IF NOT EXISTS user_presence (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE internal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- RLS Policies for internal_messages
CREATE POLICY "Users can view their own messages"
  ON internal_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON internal_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
  ON internal_messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can delete their own messages"
  ON internal_messages FOR DELETE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their own chats"
  ON chat_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own chat messages"
  ON chat_messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- RLS Policies for user_presence
CREATE POLICY "Users can view all presence"
  ON user_presence FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own presence"
  ON user_presence FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own presence"
  ON user_presence FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for chat and presence
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;

-- Create indexes for better performance
CREATE INDEX idx_internal_messages_recipient ON internal_messages(recipient_id, created_at DESC);
CREATE INDEX idx_internal_messages_sender ON internal_messages(sender_id, created_at DESC);
CREATE INDEX idx_chat_messages_recipient ON chat_messages(recipient_id, created_at DESC);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id, created_at DESC);
CREATE INDEX idx_user_presence_online ON user_presence(is_online, last_seen DESC);