-- Create a function to auto-create student profile when application is approved
CREATE OR REPLACE FUNCTION create_student_from_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id UUID;
  generated_student_id TEXT;
BEGIN
  -- Only proceed if status changed to 'approved' or 'enrolled' and student_id is null
  IF (NEW.status IN ('approved', 'enrolled')) AND (OLD.status NOT IN ('approved', 'enrolled')) AND (NEW.student_id IS NULL) THEN
    
    -- Generate a unique student ID
    generated_student_id := 'STU' || to_char(NEW.admission_year, 'YYYY') || 
                           lpad((floor(random() * 999999) + 1)::text, 6, '0');
    
    -- Create auth user account (with a temporary password that must be changed)
    INSERT INTO auth.users (
      email,
      email_confirmed_at,
      raw_user_meta_data
    )
    VALUES (
      NEW.email,
      NOW(),
      jsonb_build_object(
        'full_name', NEW.first_name || ' ' || NEW.last_name,
        'role', 'student'
      )
    )
    RETURNING id INTO new_user_id;
    
    -- Create profile entry
    INSERT INTO profiles (
      user_id,
      full_name,
      email,
      role,
      phone,
      date_of_birth,
      address
    )
    VALUES (
      new_user_id,
      NEW.first_name || ' ' || NEW.last_name,
      NEW.email,
      'student',
      NEW.phone,
      NEW.date_of_birth,
      NEW.address
    );
    
    -- Update application with generated student_id
    NEW.student_id := generated_student_id;
    
    -- Update any existing payments from application_id to student_id
    UPDATE student_payments 
    SET student_id = new_user_id, application_id = NULL
    WHERE application_id = NEW.id;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on student_applications
DROP TRIGGER IF EXISTS trigger_create_student_on_approval ON student_applications;
CREATE TRIGGER trigger_create_student_on_approval
  BEFORE UPDATE ON student_applications
  FOR EACH ROW
  EXECUTE FUNCTION create_student_from_application();