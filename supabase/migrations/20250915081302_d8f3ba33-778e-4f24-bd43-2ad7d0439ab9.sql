-- Fix function search path security issues
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'APP' || to_char(now(), 'YYYY') || lpad((floor(random() * 999999) + 1)::text, 6, '0');
END;
$$;