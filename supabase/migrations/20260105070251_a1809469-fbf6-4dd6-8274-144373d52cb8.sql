-- CLEANUP DUPLICATE AND CONFLICTING RLS POLICIES

-- 1. agent_profiles - remove duplicate and overly permissive policies
DROP POLICY IF EXISTS "Admins can manage agent profiles" ON public.agent_profiles;
DROP POLICY IF EXISTS "Agents can update their own profile" ON public.agent_profiles;

-- 2. affiliation_requests - remove duplicate SELECT policy
DROP POLICY IF EXISTS "Admins can view all affiliation requests" ON public.affiliation_requests;

-- 3. contact_submissions - remove duplicate policies
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

-- 4. student_applications - restrict public insert
DROP POLICY IF EXISTS "Users can create applications" ON public.student_applications;

-- Allow authenticated users only to create applications
CREATE POLICY "Authenticated users can create applications"
ON public.student_applications
FOR INSERT
TO authenticated
WITH CHECK (true);