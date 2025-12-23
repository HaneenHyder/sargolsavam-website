-- Alter login_logs table to support all login types
ALTER TABLE login_logs 
ADD COLUMN IF NOT EXISTS login_type VARCHAR(20) DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS user_id VARCHAR(100);

-- Add index for login type filtering
CREATE INDEX IF NOT EXISTS idx_login_logs_type ON login_logs(login_type);

-- Update existing records (if any) to have login_type = 'admin'
UPDATE login_logs SET login_type = 'admin' WHERE login_type IS NULL;
