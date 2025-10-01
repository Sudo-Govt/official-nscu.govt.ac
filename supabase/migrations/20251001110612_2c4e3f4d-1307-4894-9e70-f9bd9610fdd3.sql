-- Insert super admin email account
INSERT INTO email_accounts (user_id, email_address, email_password, display_name, quota_mb, cpanel_account_created, is_active)
VALUES (
  '44d16e1e-bdc6-4931-b090-5c677bd76159',
  'rajvardhan@nscu.govt.ac',
  'rY$Qs$q?OHBM',
  'Admin User',
  1024,
  true,
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  email_address = EXCLUDED.email_address,
  email_password = EXCLUDED.email_password,
  cpanel_account_created = true,
  is_active = true;