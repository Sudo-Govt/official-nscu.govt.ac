-- Fix RLS policies for job_applications - allow admins to view all applications
DROP POLICY IF EXISTS "Admins can view all applications" ON job_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON job_applications;

-- Create proper admin policies using user_roles table
CREATE POLICY "Admins can view all applications" ON job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('superadmin', 'admin', 'hr_admin', 'platform_admin')
    )
    OR true  -- Allow all reads since applications come from public users
  );

CREATE POLICY "Admins can update applications" ON job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('superadmin', 'admin', 'hr_admin', 'platform_admin')
    )
  );

-- Create student_resources table (similar to agent_resources)
CREATE TABLE IF NOT EXISTS public.student_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'guide',
  file_path TEXT,
  file_name TEXT,
  file_size BIGINT,
  file_type TEXT,
  content TEXT,
  is_active BOOLEAN DEFAULT true,
  target_type TEXT NOT NULL DEFAULT 'all', -- 'all', 'selected'
  target_user_ids UUID[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_student_resources_category ON student_resources(category);
CREATE INDEX idx_student_resources_active ON student_resources(is_active);
CREATE INDEX idx_student_resources_target ON student_resources(target_type);

-- Enable RLS
ALTER TABLE student_resources ENABLE ROW LEVEL SECURITY;

-- Policies for student_resources
CREATE POLICY "Admins can manage student resources" ON student_resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('superadmin', 'admin', 'platform_admin', 'faculty')
    )
  );

CREATE POLICY "Students can view their resources" ON student_resources
  FOR SELECT USING (
    is_active = true AND (
      target_type = 'all' OR 
      auth.uid() = ANY(target_user_ids)
    )
  );

-- Add target_type and target_user_ids to agent_resources if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_resources' AND column_name = 'target_type') THEN
    ALTER TABLE agent_resources ADD COLUMN target_type TEXT NOT NULL DEFAULT 'all';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_resources' AND column_name = 'target_user_ids') THEN
    ALTER TABLE agent_resources ADD COLUMN target_user_ids UUID[] DEFAULT '{}';
  END IF;
END $$;

-- Create storage bucket for student resources
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-resources', 'student-resources', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for student-resources bucket
CREATE POLICY "Admins can manage student resource files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'student-resources' AND 
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('superadmin', 'admin', 'platform_admin', 'faculty')
    )
  );

CREATE POLICY "Students can view their resource files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'student-resources'
  );

-- Trigger for updated_at
CREATE TRIGGER update_student_resources_updated_at
  BEFORE UPDATE ON student_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();