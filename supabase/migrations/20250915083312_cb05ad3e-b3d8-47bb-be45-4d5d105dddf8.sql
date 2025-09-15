-- Drop existing storage policies if they exist and recreate them
DROP POLICY IF EXISTS "Agents can upload documents for their applications" ON storage.objects;
DROP POLICY IF EXISTS "Agents can view documents for their applications" ON storage.objects;
DROP POLICY IF EXISTS "Agents can update documents for their applications" ON storage.objects;
DROP POLICY IF EXISTS "Agents can delete documents for their applications" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all student documents" ON storage.objects;

-- Create storage policies for student-documents bucket
-- Allow agents to upload documents for their student applications
CREATE POLICY "Agents can upload documents for their applications"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'student-documents' AND
  auth.uid() IN (
    SELECT ap.user_id 
    FROM agent_profiles ap
    JOIN student_applications sa ON sa.agent_id = ap.id
    WHERE (storage.foldername(name))[1] = sa.id::text
  )
);

-- Allow agents to view documents for their student applications
CREATE POLICY "Agents can view documents for their applications"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'student-documents' AND
  auth.uid() IN (
    SELECT ap.user_id 
    FROM agent_profiles ap
    JOIN student_applications sa ON sa.agent_id = ap.id
    WHERE (storage.foldername(name))[1] = sa.id::text
  )
);

-- Allow agents to update documents for their student applications
CREATE POLICY "Agents can update documents for their applications"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'student-documents' AND
  auth.uid() IN (
    SELECT ap.user_id 
    FROM agent_profiles ap
    JOIN student_applications sa ON sa.agent_id = ap.id
    WHERE (storage.foldername(name))[1] = sa.id::text
  )
);

-- Allow agents to delete documents for their student applications
CREATE POLICY "Agents can delete documents for their applications"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'student-documents' AND
  auth.uid() IN (
    SELECT ap.user_id 
    FROM agent_profiles ap
    JOIN student_applications sa ON sa.agent_id = ap.id
    WHERE (storage.foldername(name))[1] = sa.id::text
  )
);

-- Allow admins to manage all documents in student-documents bucket
CREATE POLICY "Admins can manage all student documents"
ON storage.objects
FOR ALL
USING (bucket_id = 'student-documents' AND is_admin())
WITH CHECK (bucket_id = 'student-documents' AND is_admin());