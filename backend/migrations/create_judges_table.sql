-- Create Judges Table
CREATE TABLE IF NOT EXISTS judges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Judge Assignments Table
CREATE TABLE IF NOT EXISTS judge_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judge_id UUID REFERENCES judges(id) ON DELETE CASCADE,
    date VARCHAR(50), -- e.g. "Monday 22 December 2025"
    time VARCHAR(50), -- e.g. "4:30-5:30 PM"
    stage VARCHAR(50), -- e.g. "Stage 4"
    event_name VARCHAR(200), -- e.g. "ഖുർആൻ പാരായണം"
    category VARCHAR(50), -- e.g. "JNR"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
