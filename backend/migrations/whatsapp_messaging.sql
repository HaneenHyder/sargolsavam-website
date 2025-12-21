-- WhatsApp Messaging System Tables

-- Judges Table
CREATE TABLE IF NOT EXISTS whatsapp_judges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Templates Table
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'morning_schedule', 'pre_event'
    content TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}', -- List of variables used
    type VARCHAR(50) NOT NULL, -- 'system', 'custom'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Judge Schedules Table (Parsed from CSV)
CREATE TABLE IF NOT EXISTS whatsapp_judge_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judge_id UUID REFERENCES whatsapp_judges(id),
    day VARCHAR(50),
    date DATE,
    event_name VARCHAR(255),
    category VARCHAR(100),
    stage VARCHAR(100),
    time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generated Messages Table
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judge_id UUID REFERENCES whatsapp_judges(id),
    template_id UUID REFERENCES whatsapp_templates(id),
    schedule_id UUID REFERENCES whatsapp_judge_schedules(id), -- Nullable if generic like 'initial_info'
    message_content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Sent'
    sent_at TIMESTAMP,
    sent_by VARCHAR(100), -- Admin username
    type VARCHAR(50), -- 'initial_info', 'morning_schedule', 'pre_event', 'thank_you'
    group_id VARCHAR(100), -- To group messages if needed (e.g. unique per generation run)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Templates (Using ON CONFLICT to avoid duplicates if rerun)
INSERT INTO whatsapp_templates (name, content, variables, type) VALUES
('initial_info', 'Assalamu Alaikum *{JudgeName}*,\n\nWarm greetings from the *Sargolsavam 2025–26 Organizing Committee* 🌿\n\nWe sincerely thank you for graciously accepting our invitation to serve as a judge for Sargolsavam 2025–26. Your presence and expertise are invaluable to our students and the success of the festival.\n\n📌 Kindly note:\n• Official updates and reminders related to your judging duties will be shared via *WhatsApp*.\n• These messages are *system-generated* for accuracy and timely coordination.\n• No promotional or unnecessary messages will be sent.\n\nWe truly appreciate your cooperation and support.\n\nWith respect,\n— *Sargolsavam 2025–26 Organizing Committee*', '{"JudgeName"}', 'system'),

('morning_schedule', 'Assalamu Alaikum *{JudgeName}*,\n\nGood morning 🌤️\nThis is an official update from the *Sargolsavam 2025–26 Organizing Committee*.\n\nBelow is your judging schedule for *{Day}, {Date}*:\n\n{EventList}\n\n⏱️ Kindly report at the respective venue *15 minutes prior* to the first assigned event.\n\n📌 _This is a system-generated reminder to ensure smooth coordination._\n\nThank you for your valuable support and cooperation.\n\n— *Sargolsavam 2025–26 Organizing Committee*', '{"JudgeName", "Day", "Date", "EventList"}', 'system'),

('pre_event', 'Assalamu Alaikum *{JudgeName}*,\n\n⏰ This is a gentle reminder for your upcoming judging assignment:\n\n🎤 *{EventName}*\nCategory: {Category}\n🕒 Time: {Time}\n📍 Stage: {Stage}\n\nKindly proceed to the venue at your convenience.\n\n📌 _This is a system-generated reminder._\n\nWith thanks,\n— *Sargolsavam 2025–26 Organizing Committee*', '{"JudgeName", "EventName", "Category", "Time", "Stage"}', 'system'),

('final_thank_you', 'Assalamu Alaikum *{JudgeName}*,\n\nOn behalf of *Azharul Uloom College of Islamic and Linguistic Studies* and the *Sargolsavam 2025–26 Organizing Committee*, we extend our heartfelt gratitude for your dedicated service as a judge.\n\nYour time, fairness, and encouragement have greatly contributed to the success of the festival and the confidence of our students.\n\nWe sincerely thank you for your valuable support.\n\nWith warm regards,\n— *Sargolsavam 2025–26 Organizing Committee*', '{"JudgeName"}', 'system')
ON CONFLICT (name) DO UPDATE 
SET content = EXCLUDED.content, variables = EXCLUDED.variables;
