-- Delete email folders for the users whose email accounts were deleted
DELETE FROM email_folders 
WHERE user_id IN ('f940dba9-4b0d-42a9-b928-97649739ffe4', 'eae23085-7f29-4dc1-bd66-bc363688cf91');