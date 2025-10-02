-- Add currency field to agent_profiles
ALTER TABLE agent_profiles 
ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'USD';

-- Add currency preference to profiles for admin users
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'USD';

-- Create student_payments table
CREATE TABLE IF NOT EXISTS student_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(user_id),
  agent_id UUID NOT NULL REFERENCES agent_profiles(id),
  payment_amount NUMERIC NOT NULL,
  balance_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  agent_currency TEXT NOT NULL DEFAULT 'USD',
  exchange_rate NUMERIC NOT NULL DEFAULT 1.0,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(user_id)
);

-- Enable RLS
ALTER TABLE student_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_payments
CREATE POLICY "Agents can view their own payments"
  ON student_payments
  FOR SELECT
  USING (agent_id IN (
    SELECT id FROM agent_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Agents can insert their own payments"
  ON student_payments
  FOR INSERT
  WITH CHECK (agent_id IN (
    SELECT id FROM agent_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all payments"
  ON student_payments
  FOR ALL
  USING (is_admin());

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_student_payments_agent_id ON student_payments(agent_id);
CREATE INDEX IF NOT EXISTS idx_student_payments_student_id ON student_payments(student_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_student_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_student_payments_updated_at
  BEFORE UPDATE ON student_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_student_payments_updated_at();