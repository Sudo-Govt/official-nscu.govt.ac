-- Add access control to documents_generated table
ALTER TABLE documents_generated ADD COLUMN IF NOT EXISTS access_level text DEFAULT 'admin_only';
ALTER TABLE documents_generated ADD COLUMN IF NOT EXISTS accessible_to uuid[];
ALTER TABLE documents_generated ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Update RLS policies for documents_generated to support access control
DROP POLICY IF EXISTS "Admins can manage all generated documents" ON documents_generated;
DROP POLICY IF EXISTS "Students can view their own generated documents" ON documents_generated;
DROP POLICY IF EXISTS "Agents can view accessible documents" ON documents_generated;

-- New RLS policies for documents_generated
CREATE POLICY "Admins can manage all generated documents"
ON documents_generated
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Students can view accessible documents"
ON documents_generated
FOR SELECT
TO authenticated
USING (
  is_public = true OR
  auth.uid() = ANY(accessible_to) OR
  (access_level = 'student_specific' AND auth.uid() IN (
    SELECT s.user_id FROM profiles s WHERE s.user_id = auth.uid()
  ))
);

CREATE POLICY "Agents can view accessible documents"
ON documents_generated
FOR SELECT  
TO authenticated
USING (
  auth.uid() = ANY(accessible_to) OR
  (access_level = 'agent_specific' AND auth.uid() IN (
    SELECT ap.user_id FROM agent_profiles ap WHERE ap.user_id = auth.uid()
  ))
);