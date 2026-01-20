-- Create sequence if not exists
CREATE SEQUENCE IF NOT EXISTS dept_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS faculty_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS course_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS subject_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS topic_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS lesson_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS book_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS enrollment_seq START 1;

-- Create triggers for auto-generating codes
CREATE TRIGGER generate_dept_code_trigger
BEFORE INSERT ON public.academic_departments
FOR EACH ROW
EXECUTE FUNCTION public.generate_dept_code();

CREATE TRIGGER generate_faculty_code_trigger
BEFORE INSERT ON public.academic_faculties
FOR EACH ROW
EXECUTE FUNCTION public.generate_faculty_code();

CREATE TRIGGER generate_course_code_trigger
BEFORE INSERT ON public.academic_courses
FOR EACH ROW
EXECUTE FUNCTION public.generate_course_code();

CREATE TRIGGER generate_subject_code_trigger
BEFORE INSERT ON public.academic_subjects
FOR EACH ROW
EXECUTE FUNCTION public.generate_subject_code();

CREATE TRIGGER generate_topic_code_trigger
BEFORE INSERT ON public.academic_topics
FOR EACH ROW
EXECUTE FUNCTION public.generate_topic_code();

CREATE TRIGGER generate_lesson_code_trigger
BEFORE INSERT ON public.academic_lessons
FOR EACH ROW
EXECUTE FUNCTION public.generate_lesson_code();

CREATE TRIGGER generate_book_code_trigger
BEFORE INSERT ON public.library_books
FOR EACH ROW
EXECUTE FUNCTION public.generate_book_code();

CREATE TRIGGER generate_enrollment_number_trigger
BEFORE INSERT ON public.academic_students
FOR EACH ROW
EXECUTE FUNCTION public.generate_enrollment_number();