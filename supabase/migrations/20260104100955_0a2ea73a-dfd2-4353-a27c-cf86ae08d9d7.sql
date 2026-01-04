-- Fix RLS for agents to view applications they submitted
-- Currently agents can only see apps where user_id = auth.uid(), but for agent-submitted apps, user_id is NULL or student's ID

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view their own applications" ON public.student_applications;

-- Create proper policy allowing agents to see their own applications
CREATE POLICY "Agents can view applications they submitted"
ON public.student_applications
FOR SELECT
USING (
  agent_id IN (
    SELECT id FROM public.agent_profiles WHERE user_id = auth.uid()
  )
);

-- Also allow students to view their own applications
CREATE POLICY "Students can view their own applications"
ON public.student_applications
FOR SELECT
USING (user_id = auth.uid());

-- Fix student_documents: agents need to see docs for their applications
DROP POLICY IF EXISTS "Students can view their own documents" ON public.student_documents;

CREATE POLICY "Agents can view documents for their applications"
ON public.student_documents
FOR SELECT
USING (
  application_id IN (
    SELECT sa.id FROM public.student_applications sa
    JOIN public.agent_profiles ap ON sa.agent_id = ap.id
    WHERE ap.user_id = auth.uid()
  )
);

CREATE POLICY "Students can view their own documents"
ON public.student_documents
FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  )
);

-- Agents need INSERT on student_documents for their applications
CREATE POLICY "Agents can upload documents for their applications"
ON public.student_documents
FOR INSERT
WITH CHECK (
  application_id IN (
    SELECT sa.id FROM public.student_applications sa
    JOIN public.agent_profiles ap ON sa.agent_id = ap.id
    WHERE ap.user_id = auth.uid()
  )
);