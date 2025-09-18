-- Update documents_generated table to use json_content instead of html_content
ALTER TABLE documents_generated 
DROP COLUMN html_content,
ADD COLUMN json_content TEXT NOT NULL DEFAULT '{}';