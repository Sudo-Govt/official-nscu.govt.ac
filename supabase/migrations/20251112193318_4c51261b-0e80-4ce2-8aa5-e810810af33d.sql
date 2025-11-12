-- Add final missing columns

-- Add columns to alumni_profiles
ALTER TABLE public.alumni_profiles
  ADD COLUMN IF NOT EXISTS minor text,
  ADD COLUMN IF NOT EXISTS current_company text,
  ADD COLUMN IF NOT EXISTS personal_website text,
  ADD COLUMN IF NOT EXISTS skills text[],
  ADD COLUMN IF NOT EXISTS achievements text[],
  ADD COLUMN IF NOT EXISTS interests text[];

-- Add columns to alumni_document_requests
ALTER TABLE public.alumni_document_requests
  ADD COLUMN IF NOT EXISTS requester_id uuid REFERENCES auth.users,
  ADD COLUMN IF NOT EXISTS delivery_method text,
  ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS urgent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS processed_by uuid REFERENCES auth.users,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS delivery_address text;

-- Create alumni_support_tickets table
CREATE TABLE IF NOT EXISTS public.alumni_support_tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  category text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to uuid REFERENCES auth.users,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE public.alumni_support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets" ON public.alumni_support_tickets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create tickets" ON public.alumni_support_tickets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all tickets" ON public.alumni_support_tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Add trigger for alumni_support_tickets updated_at
CREATE TRIGGER update_alumni_support_tickets_updated_at 
  BEFORE UPDATE ON public.alumni_support_tickets 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add agent_id column to student_applications if it doesn't exist
ALTER TABLE public.student_applications
  ADD COLUMN IF NOT EXISTS agent_id uuid REFERENCES agent_profiles(id);