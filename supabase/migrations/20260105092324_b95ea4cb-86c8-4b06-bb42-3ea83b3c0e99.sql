-- Fix the function search path for generate_payment_code
CREATE OR REPLACE FUNCTION public.generate_payment_code()
RETURNS text 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  letters text := 'ABCDEFGHJKMNPQRSTUVWXYZ';
  digits text := '23456789';
  code text;
  letter_part text := '';
  digit_part text := '';
  i integer;
BEGIN
  FOR i IN 1..3 LOOP
    letter_part := letter_part || substr(letters, floor(random() * length(letters) + 1)::int, 1);
  END LOOP;
  
  FOR i IN 1..6 LOOP
    digit_part := digit_part || substr(digits, floor(random() * length(digits) + 1)::int, 1);
  END LOOP;
  
  code := letter_part || '-' || substr(digit_part, 1, 3) || '-' || substr(digit_part, 4, 3);
  
  RETURN code;
END;
$$;