-- Add all missing columns to existing tables

-- Add columns to agent_profiles
ALTER TABLE public.agent_profiles
  ADD COLUMN IF NOT EXISTS agent_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS kyc_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS total_earnings numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS languages text[],
  ADD COLUMN IF NOT EXISTS contact_info jsonb,
  ADD COLUMN IF NOT EXISTS preferred_currency text DEFAULT 'USD';

-- Add columns to emails
ALTER TABLE public.emails
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'delivered',
  ADD COLUMN IF NOT EXISTS email_type text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS received_at timestamptz;

-- Add columns to student_documents
ALTER TABLE public.student_documents
  ADD COLUMN IF NOT EXISTS ai_fraud_score numeric,
  ADD COLUMN IF NOT EXISTS blockchain_hash text,
  ADD COLUMN IF NOT EXISTS verification_notes text;

-- Create agent_communications table if not exists
CREATE TABLE IF NOT EXISTS public.agent_communications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id uuid REFERENCES agent_profiles(id) ON DELETE CASCADE,
  application_id uuid REFERENCES student_applications(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  message_type text DEFAULT 'general',
  priority text DEFAULT 'normal',
  is_read boolean DEFAULT false,
  sender_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.agent_communications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agents can view their own communications" ON public.agent_communications;
CREATE POLICY "Agents can view their own communications" ON public.agent_communications 
  FOR SELECT USING (
    agent_id IN (SELECT id FROM public.agent_profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can view all communications" ON public.agent_communications;
CREATE POLICY "Admins can view all communications" ON public.agent_communications 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

DROP POLICY IF EXISTS "Users can create communications" ON public.agent_communications;
CREATE POLICY "Users can create communications" ON public.agent_communications 
  FOR INSERT WITH CHECK (true);

-- Create student_payments table if not exists
CREATE TABLE IF NOT EXISTS public.student_payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  application_id uuid REFERENCES student_applications(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  payment_type text NOT NULL,
  payment_method text NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  payment_date timestamptz,
  due_date timestamptz,
  receipt_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.student_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own payments" ON public.student_payments;
CREATE POLICY "Students can view their own payments" ON public.student_payments 
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage all payments" ON public.student_payments;
CREATE POLICY "Admins can manage all payments" ON public.student_payments 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin', 'finance'))
  );

-- Add trigger for student_payments updated_at
DROP TRIGGER IF EXISTS update_student_payments_updated_at ON public.student_payments;
CREATE TRIGGER update_student_payments_updated_at 
  BEFORE UPDATE ON public.student_payments 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();