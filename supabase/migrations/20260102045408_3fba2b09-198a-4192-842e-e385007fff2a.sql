-- Fix signup failure: add correct unique constraint for ON CONFLICT (user_id, role)
ALTER TABLE public.user_roles
  DROP CONSTRAINT IF EXISTS user_roles_user_id_key;

ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);

-- Fix infinite recursion: drop ALL existing policies on user_roles and recreate non-recursive ones
DO $$
DECLARE r record;
BEGIN
  FOR r IN (
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_roles', r.policyname);
  END LOOP;
END $$;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Superadmins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'))
WITH CHECK (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Service role can manage all roles"
ON public.user_roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
