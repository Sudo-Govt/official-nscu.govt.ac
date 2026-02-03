-- Add course_slug column to content_generation_queue for page links
ALTER TABLE content_generation_queue ADD COLUMN IF NOT EXISTS course_slug TEXT;