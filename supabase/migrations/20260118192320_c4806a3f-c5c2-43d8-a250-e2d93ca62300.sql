-- =====================================================
-- HIERARCHICAL COURSE MANAGEMENT SYSTEM
-- Scalable schema with auto-generated codes
-- =====================================================

-- 1. DEPARTMENTS TABLE
CREATE TABLE public.academic_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. FACULTIES TABLE
CREATE TABLE public.academic_faculties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES public.academic_departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ACADEMIC COURSES TABLE (separate from existing courses table)
CREATE TABLE public.academic_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES public.academic_faculties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  course_code TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE,
  duration_months INTEGER NOT NULL DEFAULT 12,
  total_credits INTEGER NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  short_description TEXT,
  long_description TEXT,
  thumbnail_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_visible_on_website BOOLEAN DEFAULT true,
  enrollment_status TEXT DEFAULT 'open' CHECK (enrollment_status IN ('open', 'closed', 'coming_soon')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SUBJECTS TABLE
CREATE TABLE public.academic_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.academic_courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject_code TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 0,
  semester INTEGER,
  order_index INTEGER DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TOPICS TABLE
CREATE TABLE public.academic_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.academic_subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  topic_code TEXT UNIQUE NOT NULL,
  order_index INTEGER DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. LESSONS TABLE
CREATE TABLE public.academic_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.academic_topics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lesson_code TEXT UNIQUE NOT NULL,
  content TEXT,
  video_url TEXT,
  order_index INTEGER DEFAULT 0,
  estimated_duration_minutes INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. LIBRARY BOOKS TABLE
CREATE TABLE public.library_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  volume TEXT,
  isbn TEXT,
  publisher TEXT,
  publication_year INTEGER,
  book_code TEXT UNIQUE NOT NULL,
  cover_image_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. COURSE BOOKS (Many-to-Many)
CREATE TABLE public.course_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.academic_courses(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, book_id)
);

-- 9. ACADEMIC STUDENTS TABLE
CREATE TABLE public.academic_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.academic_courses(id) ON DELETE CASCADE,
  enrollment_number TEXT UNIQUE NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. STUDENT PROGRESS TABLE
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.academic_students(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.academic_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completion_date TIMESTAMPTZ,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);

-- =====================================================
-- SEQUENCES FOR AUTO-GENERATING CODES
-- =====================================================

CREATE SEQUENCE IF NOT EXISTS dept_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS faculty_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS course_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS subject_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS topic_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS lesson_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS book_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS enrollment_seq START 1;

-- =====================================================
-- FUNCTIONS FOR AUTO-GENERATING CODES
-- =====================================================

CREATE OR REPLACE FUNCTION generate_dept_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := 'DEPT' || LPAD(nextval('dept_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_faculty_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := 'FAC' || LPAD(nextval('faculty_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_subject_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.subject_code IS NULL OR NEW.subject_code = '' THEN
    NEW.subject_code := 'SUB' || LPAD(nextval('subject_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_topic_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.topic_code IS NULL OR NEW.topic_code = '' THEN
    NEW.topic_code := 'TOPIC' || LPAD(nextval('topic_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_lesson_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lesson_code IS NULL OR NEW.lesson_code = '' THEN
    NEW.lesson_code := 'LESSON' || LPAD(nextval('lesson_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_book_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.book_code IS NULL OR NEW.book_code = '' THEN
    NEW.book_code := 'BOOK' || LPAD(nextval('book_code_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_enrollment_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.enrollment_number IS NULL OR NEW.enrollment_number = '' THEN
    NEW.enrollment_number := 'ENR' || EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || LPAD(nextval('enrollment_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR AUTO-GENERATING CODES
-- =====================================================

CREATE TRIGGER set_dept_code BEFORE INSERT ON public.academic_departments
FOR EACH ROW EXECUTE FUNCTION generate_dept_code();

CREATE TRIGGER set_faculty_code BEFORE INSERT ON public.academic_faculties
FOR EACH ROW EXECUTE FUNCTION generate_faculty_code();

CREATE TRIGGER set_course_code BEFORE INSERT ON public.academic_courses
FOR EACH ROW EXECUTE FUNCTION generate_course_code();

CREATE TRIGGER set_subject_code BEFORE INSERT ON public.academic_subjects
FOR EACH ROW EXECUTE FUNCTION generate_subject_code();

CREATE TRIGGER set_topic_code BEFORE INSERT ON public.academic_topics
FOR EACH ROW EXECUTE FUNCTION generate_topic_code();

CREATE TRIGGER set_lesson_code BEFORE INSERT ON public.academic_lessons
FOR EACH ROW EXECUTE FUNCTION generate_lesson_code();

CREATE TRIGGER set_book_code BEFORE INSERT ON public.library_books
FOR EACH ROW EXECUTE FUNCTION generate_book_code();

CREATE TRIGGER set_enrollment_number BEFORE INSERT ON public.academic_students
FOR EACH ROW EXECUTE FUNCTION generate_enrollment_number();

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================

CREATE TRIGGER update_academic_departments_updated_at BEFORE UPDATE ON public.academic_departments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_faculties_updated_at BEFORE UPDATE ON public.academic_faculties
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_courses_updated_at BEFORE UPDATE ON public.academic_courses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_subjects_updated_at BEFORE UPDATE ON public.academic_subjects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_topics_updated_at BEFORE UPDATE ON public.academic_topics
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_lessons_updated_at BEFORE UPDATE ON public.academic_lessons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_library_books_updated_at BEFORE UPDATE ON public.library_books
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_students_updated_at BEFORE UPDATE ON public.academic_students
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON public.student_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE & SCALABILITY
-- =====================================================

CREATE INDEX idx_academic_faculties_department ON public.academic_faculties(department_id);
CREATE INDEX idx_academic_courses_faculty ON public.academic_courses(faculty_id);
CREATE INDEX idx_academic_courses_slug ON public.academic_courses(slug);
CREATE INDEX idx_academic_courses_visible ON public.academic_courses(is_visible_on_website, is_active);
CREATE INDEX idx_academic_subjects_course ON public.academic_subjects(course_id);
CREATE INDEX idx_academic_subjects_order ON public.academic_subjects(course_id, order_index);
CREATE INDEX idx_academic_topics_subject ON public.academic_topics(subject_id);
CREATE INDEX idx_academic_topics_order ON public.academic_topics(subject_id, order_index);
CREATE INDEX idx_academic_lessons_topic ON public.academic_lessons(topic_id);
CREATE INDEX idx_academic_lessons_order ON public.academic_lessons(topic_id, order_index);
CREATE INDEX idx_course_books_course ON public.course_books(course_id);
CREATE INDEX idx_course_books_book ON public.course_books(book_id);
CREATE INDEX idx_academic_students_user ON public.academic_students(user_id);
CREATE INDEX idx_academic_students_course ON public.academic_students(course_id);
CREATE INDEX idx_student_progress_student ON public.student_progress(student_id);
CREATE INDEX idx_student_progress_lesson ON public.student_progress(lesson_id);
CREATE INDEX idx_student_progress_completed ON public.student_progress(student_id, is_completed);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

ALTER TABLE public.academic_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Public read access for catalog browsing
CREATE POLICY "Public can view active departments" ON public.academic_departments
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active faculties" ON public.academic_faculties
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view visible courses" ON public.academic_courses
FOR SELECT USING (is_active = true AND is_visible_on_website = true);

CREATE POLICY "Public can view active subjects" ON public.academic_subjects
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active topics" ON public.academic_topics
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active lessons" ON public.academic_lessons
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active books" ON public.library_books
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view course books" ON public.course_books
FOR SELECT USING (true);

-- Admin full access (using profiles role check)
CREATE POLICY "Admins can manage departments" ON public.academic_departments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'platform_admin')
  )
);

CREATE POLICY "Admins can manage faculties" ON public.academic_faculties
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'platform_admin')
  )
);

CREATE POLICY "Admins can manage courses" ON public.academic_courses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'platform_admin')
  )
);

CREATE POLICY "Admins can manage subjects" ON public.academic_subjects
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'platform_admin')
  )
);

CREATE POLICY "Admins can manage topics" ON public.academic_topics
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'platform_admin')
  )
);

CREATE POLICY "Admins can manage lessons" ON public.academic_lessons
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'platform_admin')
  )
);

CREATE POLICY "Admins can manage books" ON public.library_books
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'platform_admin')
  )
);

CREATE POLICY "Admins can manage course books" ON public.course_books
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'platform_admin')
  )
);

CREATE POLICY "Admins can manage academic students" ON public.academic_students
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'platform_admin')
  )
);

-- Students can view their own enrollment
CREATE POLICY "Students can view own enrollment" ON public.academic_students
FOR SELECT USING (user_id = auth.uid());

-- Student progress policies
CREATE POLICY "Admins can manage student progress" ON public.student_progress
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'platform_admin')
  )
);

CREATE POLICY "Students can view own progress" ON public.student_progress
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.academic_students
    WHERE academic_students.id = student_progress.student_id
    AND academic_students.user_id = auth.uid()
  )
);

CREATE POLICY "Students can update own progress" ON public.student_progress
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.academic_students
    WHERE academic_students.id = student_progress.student_id
    AND academic_students.user_id = auth.uid()
  )
);

CREATE POLICY "Students can insert own progress" ON public.student_progress
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.academic_students
    WHERE academic_students.id = student_progress.student_id
    AND academic_students.user_id = auth.uid()
  )
);