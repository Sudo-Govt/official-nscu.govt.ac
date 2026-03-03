-- SECURITY FIX: Drop overpermissive internal-attachments SELECT policy
DROP POLICY IF EXISTS "Users can view internal attachments" ON storage.objects;

-- Recreate restrictive policy: user can view files they uploaded OR files from messages they participate in
DROP POLICY IF EXISTS "Users can view attachments for their messages" ON storage.objects;
CREATE POLICY "Users can view attachments for their messages"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'internal-attachments' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.internal_message_attachments ima
      JOIN public.internal_messages im ON im.id = ima.message_id
      WHERE (im.sender_id = auth.uid() OR im.recipient_id = auth.uid())
      AND ima.file_path = name
    )
  )
);