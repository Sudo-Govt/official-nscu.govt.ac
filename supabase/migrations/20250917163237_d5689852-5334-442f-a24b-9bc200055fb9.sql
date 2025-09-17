-- Fix security vulnerability in alumni_verification_requests table
-- Remove the unsafe "Anyone can create verification requests" policy
DROP POLICY IF EXISTS "Anyone can create verification requests" ON public.alumni_verification_requests;

-- Remove the potentially problematic select policy
DROP POLICY IF EXISTS "Anyone can view own verification requests" ON public.alumni_verification_requests;

-- Create secure policies that require authentication
CREATE POLICY "Authenticated users can create verification requests" 
ON public.alumni_verification_requests 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Ensure the requester email matches the authenticated user's email
  requester_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can view their own verification requests" 
ON public.alumni_verification_requests 
FOR SELECT 
TO authenticated
USING (
  -- Allow users to see only their own requests based on authenticated user's email
  requester_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can update their own pending verification requests" 
ON public.alumni_verification_requests 
FOR UPDATE 
TO authenticated
USING (
  -- Allow users to update only their own pending requests
  requester_email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
  AND status = 'pending'
)
WITH CHECK (
  -- Prevent users from changing sensitive fields
  requester_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Ensure admin policy remains intact (should already exist)
-- This allows admins to manage all verification requests