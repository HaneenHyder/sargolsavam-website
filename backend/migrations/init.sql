-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_points INTEGER DEFAULT 0
);

-- Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chest_no VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    team_code VARCHAR(50) REFERENCES teams(code),
    category VARCHAR(50),
    role VARCHAR(50) -- 'Captain', 'Vice Captain', 'Mentor', 'Participant'
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'Onstage', 'Offstage'
    item_type VARCHAR(50) NOT NULL, -- 'Individual', 'Group'
    category VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending' -- 'Pending', 'Declared'
);

-- Participants Table
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    candidate_id UUID REFERENCES candidates(id),
    team_code VARCHAR(50) REFERENCES teams(code),
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Present', 'Absent', 'Disqualified', 'Winner'
    position INTEGER, -- 1, 2, 3
    grade VARCHAR(10), -- 'A', 'B', 'C', 'NONE'
    points INTEGER DEFAULT 0,
    work_url TEXT,
    UNIQUE(event_id, candidate_id)
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin'
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admins(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    page_url TEXT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Teams Data (if not exists)
INSERT INTO teams (code, name) VALUES 
('100', 'Team 100'),
('200', 'Team 200'),
('300', 'Team 300')
ON CONFLICT (code) DO NOTHING;
