-- Fix admission_month type
ALTER TABLE public.student_applications
  ALTER COLUMN admission_month TYPE integer USING admission_month::integer;

-- Add status column to profiles
ALTER TABLE public.profiles
  ADD COLUMN status text DEFAULT 'active';

-- Create emails table
CREATE TABLE public.emails (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  from_email text NOT NULL,
  from_name text,
  to_email text NOT NULL,
  subject text NOT NULL,
  body text,
  html_body text,
  is_read boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  folder text DEFAULT 'inbox',
  attachments jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own emails" ON public.emails FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own emails" ON public.emails FOR ALL USING (user_id = auth.uid());

-- Create agent_profiles table
CREATE TABLE public.agent_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
  agency_name text,
  commission_rate numeric DEFAULT 10,
  total_applications integer DEFAULT 0,
  total_commission numeric DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view their own profile" ON public.agent_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Agents can update their own profile" ON public.agent_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage agent profiles" ON public.agent_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Create fee_payments table
CREATE TABLE public.fee_payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  payment_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own payments" ON public.fee_payments FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage payments" ON public.fee_payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin', 'finance'))
);

-- Create agent_commissions table
CREATE TABLE public.agent_commissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id uuid REFERENCES agent_profiles(id) ON DELETE CASCADE NOT NULL,
  application_id uuid REFERENCES student_applications(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  commission_rate numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.agent_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view their own commissions" ON public.agent_commissions FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agent_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage commissions" ON public.agent_commissions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin', 'finance'))
);

-- Add triggers for updated_at
CREATE TRIGGER update_agent_profiles_updated_at BEFORE UPDATE ON public.agent_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();