const db = require('../db');
const fs = require('fs');
const csv = require('csv-parser');

// 1. Upload Schedule & Parse CSV
exports.uploadSchedule = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                // Determine format
                // Expected header: JudgeName, WhatsAppNumber, Day, Date, EventName, Category, Stage, Time
                // Map to DB columns

                const client = await db.pool.connect();
                try {
                    await client.query('BEGIN');

                    for (const row of results) {
                        // 1. Insert/Get Judge
                        // Check if required fields exist
                        if (!row.JudgeName || !row.WhatsAppNumber) continue;

                        let judgeRes = await client.query(
                            'SELECT id FROM whatsapp_judges WHERE whatsapp_number = $1',
                            [row.WhatsAppNumber]
                        );

                        let judgeId;
                        if (judgeRes.rows.length === 0) {
                            const newJudge = await client.query(
                                'INSERT INTO whatsapp_judges (name, whatsapp_number) VALUES ($1, $2) RETURNING id',
                                [row.JudgeName, row.WhatsAppNumber]
                            );
                            judgeId = newJudge.rows[0].id;
                        } else {
                            judgeId = judgeRes.rows[0].id;
                        }

                        // 2. Insert Schedule
                        await client.query(
                            'INSERT INTO whatsapp_judge_schedules (judge_id, day, date, event_name, category, stage, time) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                            [
                                judgeId,
                                row.Day || 'TBD',
                                row.Date ? new Date(row.Date) : null,
                                row.EventName,
                                row.Category,
                                row.Stage,
                                row.Time
                            ]
                        );
                    }

                    await client.query('COMMIT');
                    res.json({ message: 'Schedule imported successfully', count: results.length });
                } catch (e) {
                    await client.query('ROLLBACK');
                    console.error('Import error:', e);
                    res.status(500).json({ error: 'Import failed: ' + e.message });
                } finally {
                    client.release();
                    // Cleanup uploaded file
                    fs.unlinkSync(req.file.path);
                }
            } catch (err) {
                res.status(500).json({ error: 'Error processing CSV' });
            }
        });
};

// 2. Generate Messages
exports.generateMessages = async (req, res) => {
    const { type } = req.body; // 'initial_info', 'morning_schedule', 'pre_event', 'final_thank_you'

    if (!type) {
        return res.status(400).json({ error: 'Message type is required' });
    }

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        // Fetch Template
        const templateRes = await client.query('SELECT * FROM whatsapp_templates WHERE name = $1', [type]);
        if (templateRes.rows.length === 0) {
            throw new Error('Template not found');
        }
        const template = templateRes.rows[0];

        // Fetch Judges & Schedules
        // Logic heavily depends on 'type'
        let messagesCreated = 0;
        const groupId = new Date().toISOString();

        if (type === 'initial_info' || type === 'final_thank_you') {
            // One message per judge
            const judges = await client.query('SELECT * FROM whatsapp_judges');

            for (const judge of judges.rows) {
                let content = template.content.replace('{JudgeName}', judge.name);

                await client.query(
                    'INSERT INTO whatsapp_messages (judge_id, template_id, message_content, type, group_id) VALUES ($1, $2, $3, $4, $5)',
                    [judge.id, template.id, content, type, groupId]
                );
                messagesCreated++;
            }
        }
        else if (type === 'morning_schedule') {
            // 1 message per judge per day
            const schedulesRaw = await client.query(`
                SELECT s.*, j.name as judge_name, j.id as judge_id 
                FROM whatsapp_judge_schedules s 
                JOIN whatsapp_judges j ON s.judge_id = j.id
                ORDER BY s.date, s.time
            `);

            // Group by Judge + Date
            const grouped = {};
            schedulesRaw.rows.forEach(row => {
                const key = `${row.judge_id}_${row.date}`; // Simplistic key
                if (!grouped[key]) grouped[key] = { judge: row, events: [] };
                grouped[key].events.push(row);
            });

            for (const key in grouped) {
                const group = grouped[key];
                const judge = group.judge;
                const events = group.events;

                if (events.length === 0) continue;

                // Build Event List String
                let eventListStr = events.map((e, idx) => {
                    return `${idx + 1}️⃣ ${e.event_name} — ${e.category}\n` +
                        `🕓 ${e.time}\n` +
                        `📍 ${e.stage}\n`;
                }).join('\n');

                let content = template.content
                    .replace('{JudgeName}', judge.judge_name)
                    .replace('{Day}', events[0].day)
                    .replace('{Date}', events[0].date ? new Date(events[0].date).toLocaleDateString() : 'TBD') // Basic Formatting
                    .replace('{EventList}', eventListStr);

                await client.query(
                    'INSERT INTO whatsapp_messages (judge_id, template_id, message_content, type, group_id) VALUES ($1, $2, $3, $4, $5)',
                    [judge.judge_id, template.id, content, type, groupId]
                );
                messagesCreated++;
            }
        }
        else if (type === 'pre_event') {
            // 1 message per EVENT per judge
            const schedules = await client.query(`
                SELECT s.*, j.name as judge_name, j.id as judge_id 
                FROM whatsapp_judge_schedules s 
                JOIN whatsapp_judges j ON s.judge_id = j.id
            `);

            for (const row of schedules.rows) {
                let content = template.content
                    .replace('{JudgeName}', row.judge_name)
                    .replace('{EventName}', row.event_name)
                    .replace('{Category}', row.category)
                    .replace('{Time}', row.time)
                    .replace('{Stage}', row.stage);

                await client.query(
                    'INSERT INTO whatsapp_messages (judge_id, template_id, schedule_id, message_content, type, group_id) VALUES ($1, $2, $3, $4, $5, $6)',
                    [row.judge_id, template.id, row.id, content, type, groupId]
                );
                messagesCreated++;
            }
        }

        await client.query('COMMIT');
        res.json({ message: 'Messages generated', count: messagesCreated, groupId });

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Generate error:', e);
        res.status(500).json({ error: e.message });
    } finally {
        client.release();
    }
};

// 3. Get Messages
exports.getMessages = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT m.*, j.name as judge_name, j.whatsapp_number, t.name as template_name
            FROM whatsapp_messages m
            JOIN whatsapp_judges j ON m.judge_id = j.id
            JOIN whatsapp_templates t ON m.template_id = t.id
            ORDER BY m.created_at DESC
        `);
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 4. Mark as Sent
exports.markAsSent = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            'UPDATE whatsapp_messages SET status = $1, sent_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            ['Sent', id]
        );
        res.json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
