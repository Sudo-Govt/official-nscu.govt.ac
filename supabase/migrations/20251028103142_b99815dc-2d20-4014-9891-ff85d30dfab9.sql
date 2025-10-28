-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.student_applications;

-- Create a proper policy that allows public application submission
CREATE POLICY "Public can submit applications"
ON public.student_applications
FOR INSERT
TO anon
WITH CHECK (true);

-- Keep existing policies for authenticated users
CREATE POLICY "Authenticated users can submit applications"
ON public.student_applications
FOR INSERT
TO authenticated
WITH CHECK (true);