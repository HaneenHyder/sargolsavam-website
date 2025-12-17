-- Restore department column
ALTER TABLE committee_members ADD COLUMN IF NOT EXISTS department VARCHAR(100);
