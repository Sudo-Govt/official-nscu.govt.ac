-- Add RLS policy to allow public inserts for fast track applications
CREATE POLICY "Anyone can submit fast track applications"
ON public.student_applications
FOR INSERT
WITH CHECK (true);

-- Allow agents to view applications they submitted
CREATE POLICY "Agents can view their own applications"
ON public.student_applications
FOR SELECT
USING (
  agent_id IN (
    SELECT id FROM agent_profiles WHERE user_id = auth.uid()
  )
);