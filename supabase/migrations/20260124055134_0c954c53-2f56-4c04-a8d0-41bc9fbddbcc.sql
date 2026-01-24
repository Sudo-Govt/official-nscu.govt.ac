-- Add a column to store AI-generated structured content
ALTER TABLE public.academic_courses 
ADD COLUMN IF NOT EXISTS ai_generated_content JSONB DEFAULT NULL;

-- Add a column to track when content was generated
ALTER TABLE public.academic_courses 
ADD COLUMN IF NOT EXISTS content_generated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;