-- Fix RLS admin policies to use user_roles-based RBAC via public.is_admin(auth.uid())

-- Departments
DROP POLICY IF EXISTS "Admins can manage departments" ON public.academic_departments;
CREATE POLICY "Admins can manage departments"
ON public.academic_departments
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Faculties
DROP POLICY IF EXISTS "Admins can manage faculties" ON public.academic_faculties;
CREATE POLICY "Admins can manage faculties"
ON public.academic_faculties
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Courses
DROP POLICY IF EXISTS "Admins can manage courses" ON public.academic_courses;
CREATE POLICY "Admins can manage courses"
ON public.academic_courses
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Subjects
DROP POLICY IF EXISTS "Admins can manage subjects" ON public.academic_subjects;
CREATE POLICY "Admins can manage subjects"
ON public.academic_subjects
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Topics
DROP POLICY IF EXISTS "Admins can manage topics" ON public.academic_topics;
CREATE POLICY "Admins can manage topics"
ON public.academic_topics
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Lessons
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.academic_lessons;
CREATE POLICY "Admins can manage lessons"
ON public.academic_lessons
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Books
DROP POLICY IF EXISTS "Admins can manage books" ON public.library_books;
CREATE POLICY "Admins can manage books"
ON public.library_books
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Course books
DROP POLICY IF EXISTS "Admins can manage course books" ON public.course_books;
CREATE POLICY "Admins can manage course books"
ON public.course_books
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Academic students
DROP POLICY IF EXISTS "Admins can manage academic students" ON public.academic_students;
CREATE POLICY "Admins can manage academic students"
ON public.academic_students
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Student progress (keep student-specific policies as-is)
DROP POLICY IF EXISTS "Admins can manage student progress" ON public.student_progress;
CREATE POLICY "Admins can manage student progress"
ON public.student_progress
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
