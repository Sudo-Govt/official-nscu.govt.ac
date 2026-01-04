-- Add new roles to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'platform_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hr_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'compliance_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admission_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admission_staff';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'master_agent';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'support';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'marketing_admin';

-- Create role_permissions table to define what each role can do
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  permission_category text NOT NULL,
  permission_action text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, permission_category, permission_action)
);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Only superadmins can manage role permissions
CREATE POLICY "Only superadmins can view role permissions"
ON public.role_permissions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role IN ('superadmin', 'admin', 'platform_admin')
));

CREATE POLICY "Only superadmins can manage role permissions"
ON public.role_permissions FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'superadmin'
));

-- Insert default permissions for each role
-- Super Admin - ALL permissions
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('superadmin', 'users', 'create'), ('superadmin', 'users', 'read'), ('superadmin', 'users', 'update'), ('superadmin', 'users', 'delete'),
('superadmin', 'roles', 'create'), ('superadmin', 'roles', 'read'), ('superadmin', 'roles', 'update'), ('superadmin', 'roles', 'delete'),
('superadmin', 'admissions', 'create'), ('superadmin', 'admissions', 'read'), ('superadmin', 'admissions', 'update'), ('superadmin', 'admissions', 'delete'), ('superadmin', 'admissions', 'override'),
('superadmin', 'finance', 'read'), ('superadmin', 'finance', 'update'), ('superadmin', 'finance', 'payout'), ('superadmin', 'finance', 'override'),
('superadmin', 'compliance', 'read'), ('superadmin', 'compliance', 'update'), ('superadmin', 'compliance', 'lock'),
('superadmin', 'content', 'create'), ('superadmin', 'content', 'read'), ('superadmin', 'content', 'update'), ('superadmin', 'content', 'delete'),
('superadmin', 'system', 'logs'), ('superadmin', 'system', 'api'), ('superadmin', 'system', 'security'), ('superadmin', 'system', 'config'),
('superadmin', 'agents', 'create'), ('superadmin', 'agents', 'read'), ('superadmin', 'agents', 'update'), ('superadmin', 'agents', 'suspend'),
('superadmin', 'students', 'create'), ('superadmin', 'students', 'read'), ('superadmin', 'students', 'update'), ('superadmin', 'students', 'delete')
ON CONFLICT DO NOTHING;

-- Platform Admin
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('platform_admin', 'users', 'create'), ('platform_admin', 'users', 'read'), ('platform_admin', 'users', 'update'),
('platform_admin', 'roles', 'create'), ('platform_admin', 'roles', 'read'), ('platform_admin', 'roles', 'update'),
('platform_admin', 'admissions', 'create'), ('platform_admin', 'admissions', 'read'), ('platform_admin', 'admissions', 'update'), ('platform_admin', 'admissions', 'delete'),
('platform_admin', 'finance', 'read'),
('platform_admin', 'compliance', 'read'), ('platform_admin', 'compliance', 'update'),
('platform_admin', 'content', 'create'), ('platform_admin', 'content', 'read'), ('platform_admin', 'content', 'update'), ('platform_admin', 'content', 'delete'),
('platform_admin', 'agents', 'create'), ('platform_admin', 'agents', 'read'), ('platform_admin', 'agents', 'update'), ('platform_admin', 'agents', 'suspend'),
('platform_admin', 'students', 'create'), ('platform_admin', 'students', 'read'), ('platform_admin', 'students', 'update')
ON CONFLICT DO NOTHING;

-- HR Admin
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('hr_admin', 'users', 'create'), ('hr_admin', 'users', 'read'), ('hr_admin', 'users', 'update'),
('hr_admin', 'roles', 'read'),
('hr_admin', 'content', 'read')
ON CONFLICT DO NOTHING;

-- Finance Admin
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('finance', 'finance', 'read'), ('finance', 'finance', 'update'), ('finance', 'finance', 'payout'),
('finance', 'admissions', 'read'),
('finance', 'agents', 'read'),
('finance', 'students', 'read')
ON CONFLICT DO NOTHING;

-- Compliance Admin
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('compliance_admin', 'compliance', 'read'), ('compliance_admin', 'compliance', 'update'), ('compliance_admin', 'compliance', 'lock'),
('compliance_admin', 'agents', 'read'), ('compliance_admin', 'agents', 'update'),
('compliance_admin', 'system', 'logs')
ON CONFLICT DO NOTHING;

-- Admission Admin
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('admission_admin', 'admissions', 'create'), ('admission_admin', 'admissions', 'read'), ('admission_admin', 'admissions', 'update'), ('admission_admin', 'admissions', 'override'),
('admission_admin', 'agents', 'read'), ('admission_admin', 'agents', 'update'),
('admission_admin', 'students', 'create'), ('admission_admin', 'students', 'read'), ('admission_admin', 'students', 'update')
ON CONFLICT DO NOTHING;

-- Admission Staff
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('admission_staff', 'admissions', 'create'), ('admission_staff', 'admissions', 'read'), ('admission_staff', 'admissions', 'update'),
('admission_staff', 'students', 'read'), ('admission_staff', 'students', 'update'),
('admission_staff', 'content', 'read')
ON CONFLICT DO NOTHING;

-- Admission Agent
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('admission_agent', 'admissions', 'create'), ('admission_agent', 'admissions', 'read'),
('admission_agent', 'students', 'create'), ('admission_agent', 'students', 'read'),
('admission_agent', 'content', 'read'),
('admission_agent', 'finance', 'read')
ON CONFLICT DO NOTHING;

-- Master Agent
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('master_agent', 'admissions', 'create'), ('master_agent', 'admissions', 'read'),
('master_agent', 'students', 'create'), ('master_agent', 'students', 'read'),
('master_agent', 'agents', 'create'), ('master_agent', 'agents', 'read'),
('master_agent', 'content', 'read'),
('master_agent', 'finance', 'read')
ON CONFLICT DO NOTHING;

-- Student
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('student', 'admissions', 'read'),
('student', 'students', 'read'),
('student', 'content', 'read'),
('student', 'finance', 'read')
ON CONFLICT DO NOTHING;

-- Alumni
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('alumni', 'students', 'read'),
('alumni', 'content', 'read')
ON CONFLICT DO NOTHING;

-- Support
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('support', 'users', 'read'),
('support', 'students', 'read'),
('support', 'admissions', 'read'),
('support', 'content', 'read')
ON CONFLICT DO NOTHING;

-- Marketing Admin
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('marketing_admin', 'content', 'create'), ('marketing_admin', 'content', 'read'), ('marketing_admin', 'content', 'update'), ('marketing_admin', 'content', 'delete'),
('marketing_admin', 'agents', 'read')
ON CONFLICT DO NOTHING;

-- Auditor (Read-Only)
INSERT INTO public.role_permissions (role, permission_category, permission_action) VALUES
('auditor', 'users', 'read'),
('auditor', 'admissions', 'read'),
('auditor', 'finance', 'read'),
('auditor', 'compliance', 'read'),
('auditor', 'system', 'logs'),
('auditor', 'agents', 'read'),
('auditor', 'students', 'read')
ON CONFLICT DO NOTHING;

-- Create function to check if user has permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _category text, _action text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = _user_id
      AND rp.permission_category = _category
      AND rp.permission_action = _action
  )
$$;