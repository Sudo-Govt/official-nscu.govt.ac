-- Create storage bucket for internal message attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('internal-attachments', 'internal-attachments', false);

-- Add attachment columns to internal_messages
ALTER TABLE public.internal_messages 
ADD COLUMN attachment_url text,
ADD COLUMN attachment_name text,
ADD COLUMN attachment_size integer;

-- Create storage policies for internal message attachments
CREATE POLICY "Users can upload attachments for their messages"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'internal-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view attachments for their messages"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'internal-attachments' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.internal_messages
      WHERE (sender_id = auth.uid() OR recipient_id = auth.uid())
      AND attachment_url = name
    )
  )
);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'internal-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);