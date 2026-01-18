-- Fix function search paths for security
CREATE OR REPLACE FUNCTION generate_dept_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := 'DEPT' || LPAD(nextval('dept_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION generate_faculty_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := 'FAC' || LPAD(nextval('faculty_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION generate_course_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.course_code IS NULL OR NEW.course_code = '' THEN
    NEW.course_code := 'COURSE' || LPAD(nextval('course_code_seq')::TEXT, 3, '0');
  END IF;
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION generate_subject_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.subject_code IS NULL OR NEW.subject_code = '' THEN
    NEW.subject_code := 'SUB' || LPAD(nextval('subject_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION generate_topic_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.topic_code IS NULL OR NEW.topic_code = '' THEN
    NEW.topic_code := 'TOPIC' || LPAD(nextval('topic_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION generate_lesson_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lesson_code IS NULL OR NEW.lesson_code = '' THEN
    NEW.lesson_code := 'LESSON' || LPAD(nextval('lesson_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION generate_book_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.book_code IS NULL OR NEW.book_code = '' THEN
    NEW.book_code := 'BOOK' || LPAD(nextval('book_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION generate_enrollment_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.enrollment_number IS NULL OR NEW.enrollment_number = '' THEN
    NEW.enrollment_number := 'ENR' || EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || LPAD(nextval('enrollment_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;