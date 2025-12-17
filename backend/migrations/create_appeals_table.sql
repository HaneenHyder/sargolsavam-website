-- Create Appeals Table
CREATE TABLE IF NOT EXISTS appeals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submitted_by UUID NOT NULL, -- User ID (Candidate or Team)
    submitted_by_role VARCHAR(50) NOT NULL, -- 'candidate' or 'team'
    event_name VARCHAR(255) NOT NULL, -- Text for flexibility
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Resolved, Rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
