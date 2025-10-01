-- Update SMTP settings with correct Namecheap configuration
UPDATE smtp_settings 
SET 
  smtp_host = 'mail.govt.ac',
  smtp_port = 587,
  use_tls = true
WHERE id = '6426d600-78d6-4c34-8400-ffc3e960454b';