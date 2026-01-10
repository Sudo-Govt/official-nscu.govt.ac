-- Create student-documents storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-documents', 'student-documents', false)
ON CONFLICT (id) DO NOTHING;