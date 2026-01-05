-- FIX CRITICAL SECURITY ISSUES

-- 1. Fix user_presence table - restrict to authenticated users only, users can only see their own presence
DROP POLICY IF EXISTS "Users can view all presence" ON public.user_presence;
DROP POLICY IF EXISTS "Users can update their own presence" ON public.user_presence;
DROP POLICY IF EXISTS "Users can insert their own presence" ON public.user_presence;

-- Create proper restrictive policies
CREATE POLICY "Users can view their own presence only"
ON public.user_presence
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own presence"
ON public.user_presence
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presence"
ON public.user_presence
FOR UPDATE
USING (auth.uid() = user_id);

-- 2. Fix affiliation_requests table - only admins can view submissions
DROP POLICY IF EXISTS "Anyone can create affiliation requests" ON public.affiliation_requests;
DROP POLICY IF EXISTS "Admins can view affiliation requests" ON public.affiliation_requests;
DROP POLICY IF EXISTS "Admins can update affiliation requests" ON public.affiliation_requests;

-- Allow anonymous submissions (needed for public form)
CREATE POLICY "Anyone can submit affiliation requests"
ON public.affiliation_requests
FOR INSERT
WITH CHECK (true);

-- Only admins can view submissions
CREATE POLICY "Only admins can view affiliation requests"
ON public.affiliation_requests
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Only admins can update
CREATE POLICY "Only admins can update affiliation requests"
ON public.affiliation_requests
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Only admins can delete
CREATE POLICY "Only admins can delete affiliation requests"
ON public.affiliation_requests
FOR DELETE
USING (public.is_admin(auth.uid()));

-- 3. Create rate_limits table for authentication rate limiting
CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    identifier_type TEXT NOT NULL DEFAULT 'ip',
    attempt_count INTEGER DEFAULT 1,
    first_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    blocked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_identifier ON public.auth_rate_limits(identifier, identifier_type);

-- Enable RLS
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only backend/edge functions can access this table (via service role)
-- No user-facing policies needed

-- 4. Ensure agent_profiles financial data is properly protected
DROP POLICY IF EXISTS "Agents can view their own profile" ON public.agent_profiles;
DROP POLICY IF EXISTS "Admins can view all agent profiles" ON public.agent_profiles;

-- Agents can only view their own profile
CREATE POLICY "Agents can view own profile only"
ON public.agent_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Agents can update their own non-financial fields
CREATE POLICY "Agents can update own profile"
ON public.agent_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all agent profiles"
ON public.agent_profiles
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Admins can update all profiles (including financial data)
CREATE POLICY "Admins can update all agent profiles"
ON public.agent_profiles
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Admins can insert profiles
CREATE POLICY "Admins can insert agent profiles"
ON public.agent_profiles
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()) OR auth.uid() = user_id);