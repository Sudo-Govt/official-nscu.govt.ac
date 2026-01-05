-- Add policy for auth_rate_limits table (service role only access)
-- This table should only be accessed by edge functions using service role key

-- Create a service-only policy (effectively no public access since anon/authenticated users can't meet this)
CREATE POLICY "Service role only access"
ON public.auth_rate_limits
FOR ALL
USING (false)
WITH CHECK (false);

-- The service role key bypasses RLS, so edge functions can still access this table
-- But anonymous and authenticated users cannot