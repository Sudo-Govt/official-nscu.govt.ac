-- Update SMTP host to the correct hostname that works with mail clients
UPDATE smtp_settings 
SET smtp_host = 'mail.nscu.govt.ac'
WHERE smtp_host IN ('mail.govt.ac', 'premium12.web-hosting.com') OR smtp_host IS NULL;