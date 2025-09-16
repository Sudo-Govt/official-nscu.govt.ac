-- Add scoring columns to student_applications table
ALTER TABLE public.student_applications 
ADD COLUMN application_score integer,
ADD COLUMN scoring_breakdown jsonb;