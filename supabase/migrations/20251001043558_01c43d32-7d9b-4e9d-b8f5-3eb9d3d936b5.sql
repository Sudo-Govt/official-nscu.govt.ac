-- Create fee_payments table
CREATE TABLE public.fee_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_fees NUMERIC,
  delegator_id UUID REFERENCES public.agent_profiles(id),
  delegator_amount NUMERIC DEFAULT 0,
  delegator_percentage NUMERIC DEFAULT 0,
  transaction_type TEXT DEFAULT 'fee_payment',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all fee payments"
ON public.fee_payments
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Users can view fee payments"
ON public.fee_payments
FOR SELECT
TO authenticated
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_fee_payments_updated_at
BEFORE UPDATE ON public.fee_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_fee_payments_student_id ON public.fee_payments(student_id);
CREATE INDEX idx_fee_payments_payment_date ON public.fee_payments(payment_date DESC);