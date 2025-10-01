-- Delete the two test email accounts
DELETE FROM email_accounts 
WHERE email_address IN ('ajit@nscu.govt.ac', 'raagaver@nscu.govt.ac');