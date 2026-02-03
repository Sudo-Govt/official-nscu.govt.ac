-- Ensure admin-like roles can manage/read students
DROP POLICY IF EXISTS "Admins can manage students" ON public.students;

CREATE POLICY "Admins can manage students"
ON public.students
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = ANY (ARRAY['admin','superadmin','platform_admin','faculty']::text[])
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = ANY (ARRAY['admin','superadmin','platform_admin','faculty']::text[])
  )
);

-- Keep self-view policy restricted to logged-in users
DROP POLICY IF EXISTS "Students can view their own data" ON public.students;
CREATE POLICY "Students can view their own data"
ON public.students
FOR SELECT
TO authenticated
USING (user_id = auth.uid());