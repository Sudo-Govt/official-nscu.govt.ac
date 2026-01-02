-- Update the trigger function to assign superadmin to new email
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user is sudo@govt.ac and assign superadmin
  IF NEW.email = 'sudo@govt.ac' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'superadmin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- Default role for other users is student
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'student')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;