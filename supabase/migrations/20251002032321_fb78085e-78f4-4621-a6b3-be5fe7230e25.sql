-- Remove all student applications added by agents
DELETE FROM student_applications 
WHERE agent_id IS NOT NULL;

-- Remove all agent commissions since the applications are being deleted
DELETE FROM agent_commissions 
WHERE application_id IS NOT NULL;

-- Remove agent communications related to deleted applications
DELETE FROM agent_communications 
WHERE application_id IS NOT NULL;

-- Remove agent messages related to deleted applications
DELETE FROM agent_messages 
WHERE application_id IS NOT NULL;