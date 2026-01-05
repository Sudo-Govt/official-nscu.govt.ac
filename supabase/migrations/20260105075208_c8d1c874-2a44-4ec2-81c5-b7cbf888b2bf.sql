-- Add payment_link column to courses table for Razorpay integration
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS payment_link text;

-- Create agent_resources table for training materials, FAQs, etc.
CREATE TABLE IF NOT EXISTS public.agent_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  file_path text,
  file_name text,
  file_size integer,
  file_type text,
  content text,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_agent_resources_category ON public.agent_resources(category);

-- Enable RLS
ALTER TABLE public.agent_resources ENABLE ROW LEVEL SECURITY;

-- Admins can manage all resources
CREATE POLICY "Admins can manage agent resources"
ON public.agent_resources
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Agents can view active resources
CREATE POLICY "Agents can view active resources"
ON public.agent_resources
FOR SELECT
TO authenticated
USING (
  is_active = true 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admission_agent', 'master_agent')
  )
);

-- Create storage bucket for agent resources
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('agent-resources', 'agent-resources', false, 52428800)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for agent resources bucket
CREATE POLICY "Admins can upload agent resources"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'agent-resources' 
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update agent resources"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'agent-resources' 
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can delete agent resources"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'agent-resources' 
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Agents and admins can view agent resources"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'agent-resources' 
  AND (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admission_agent', 'master_agent')
    )
  )
);

-- Add updated_at trigger for agent_resources
CREATE TRIGGER update_agent_resources_updated_at
BEFORE UPDATE ON public.agent_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();