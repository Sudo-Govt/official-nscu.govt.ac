-- Create agent_messages table for communication between agents and students
CREATE TABLE public.agent_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.student_applications(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Agents can manage messages for their applications" 
ON public.agent_messages 
FOR ALL 
USING (
  application_id IN (
    SELECT sa.id 
    FROM student_applications sa
    JOIN agent_profiles ap ON sa.agent_id = ap.id
    WHERE ap.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all messages" 
ON public.agent_messages 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agent_messages_updated_at
BEFORE UPDATE ON public.agent_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();