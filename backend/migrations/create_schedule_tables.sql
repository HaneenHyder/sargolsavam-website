-- Create schedule_days table
CREATE TABLE IF NOT EXISTS schedule_days (
    id SERIAL PRIMARY KEY,
    date VARCHAR(100) NOT NULL,
    day_label VARCHAR(20) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create schedule_events table
CREATE TABLE IF NOT EXISTS schedule_events (
    id SERIAL PRIMARY KEY,
    day_id INT NOT NULL REFERENCES schedule_days(id) ON DELETE CASCADE,
    time VARCHAR(50) NOT NULL,
    stage VARCHAR(10) DEFAULT '-',
    item VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT '-',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_schedule_events_day_id ON schedule_events(day_id);
