const fs = require('fs');
const db = require('./src/db');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'provided_data.txt');

async function importData() {
    console.log('🚀 Starting import from provided data...');

    const content = fs.readFileSync(DATA_FILE, 'utf8');
    const lines = content.split('\n');

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        let currentJudge = null;
        let currentPhone = null;
        let currentDay = null;
        let currentDate = null;

        let totalJudges = 0;
        let totalEvents = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Split by comma
            // The file seems to have many trailing commas
            const cols = line.split(',').map(c => c.trim());
            const firstCol = cols[0];

            if (!firstCol && !cols[1]) continue; // Skip empty lines

            // 1. Detect Phone (Starts with 91 or looks like phone)
            if (/^(91|\d{5})/.test(firstCol) && firstCol.length > 5) {
                currentPhone = firstCol.replace(/\s+/g, ''); // Clean space

                // Update Judge Phone in DB
                if (currentJudge) {
                    try {
                        await client.query(
                            'UPDATE whatsapp_judges SET whatsapp_number = $1 WHERE id = $2',
                            [currentPhone, currentJudge.id]
                        );
                        console.log(`Updated phone for ${currentJudge.name}: ${currentPhone}`);
                    } catch (e) {
                        console.log(`⚠️ could not update phone for ${currentJudge.name}: ${e.message}`);
                    }
                }
                continue;
            }

            // 2. Detect Date/Day
            if (firstCol.match(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i)) {
                currentDay = firstCol.split(' ')[0]; // "Monday"
                const dateMatch = firstCol.match(/(\d{1,2} \w+ \d{4})/);
                if (dateMatch) {
                    currentDate = new Date(dateMatch[0]);
                }
                // Reset current day context if needed, but we keep it until next date line
                continue;
            }

            // 3. Detect Event Row (Starts with Time format)
            // e.g. "4:30-5:30 PM" or "3.00 - 4.00 PM"
            if (/^\d{1,2}[:.]\d{2}/.test(firstCol) || !firstCol && cols[1] && cols[2]) {
                // If firstCol is empty but later cols exist, it might be a continuation for same judge/day? 
                // e.g. ",Stage 2,..."
                // But looking at data: ",Stage 2,..." -> firstCol is empty.

                let time = firstCol;
                let stage = cols[1];
                let eventName = cols[2];
                let category = cols[3];

                if (!time && stage) {
                    // It's a subsequent event without time? Or same time? 
                    // Let's assume continuation or missing time.
                    // Actually looking at data: ",Stage 2,ഖുർആൻ പാരായണം,SJR,,"
                    // It has no time.
                    time = 'TBD';
                }

                if (currentJudge && eventName) {
                    try {
                        await client.query(
                            'INSERT INTO whatsapp_judge_schedules (judge_id, day, date, event_name, category, stage, time) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                            [
                                currentJudge.id,
                                currentDay,
                                currentDate,
                                eventName,
                                category,
                                stage,
                                time
                            ]
                        );
                        totalEvents++;
                    } catch (e) { console.log('Event Insert Error:', e.message); }
                }
                continue;
            }

            // 4. Default to Judge Name if it's mostly uppercase words and not any of above
            // And usually followed by empty columns
            // e.g. "SHUKKOOR SULTHAN NADWI,,,,,"
            // Check if it's NOT a time, NOT a date, NOT a phone.
            // Assumption: Judge names are Uppercase
            if (/[A-Z]/.test(firstCol) && !/\d/.test(firstCol)) {
                const name = firstCol;
                // Create Judge
                // Check if exists
                // We might have duplicate names, so best to treat as new or generic insert
                // But since we are iterating blocks, we assume new block = new judge context

                // If phone is not yet known, we insert name and update phone later
                // Or we can assume order: Name -> Phone

                // Insert Judge
                const res = await client.query(
                    'INSERT INTO whatsapp_judges (name, whatsapp_number) VALUES ($1, $2) ON CONFLICT (whatsapp_number) DO UPDATE SET name=$1 RETURNING id',
                    [name, 'TEMP_' + Date.now() + Math.random()] // Temporary phone until found
                );
                // Note: The ON CONFLICT is on whatsapp_number. 
                // Since we don't have phone yet, we generate a temp one.
                // When we find the phone line, we UPDATE it.
                // But wait, if we have duplicate temp phones...

                // Better strategy: Store name in `currentJudgeName` string.
                // When Phone is found, THEN insert.
                // BUT Date/Events might come before Phone?
                // Data: Name -> Phone -> Date -> Events.
                // Data: Name -> ... -> Phone -> ...

                // Wait, some blocks might not have phone? 
                // "ABDUL SHAREEF NADWI,,,,," -> ",,,,," -> "Monday..." (No phone line between?)
                // Actually looking at data:
                // ABDUL SHAREEF NADWI...
                // (Empty lines)
                // Monday 22...
                // It seems Phone IS missing for some.

                // So insert immediately.
                currentPhone = 'UNKNOWN_' + Math.random(); // Placeholder

                try {
                    const newJudge = await client.query(
                        'INSERT INTO whatsapp_judges (name, whatsapp_number) VALUES ($1, $2) RETURNING id',
                        [name, currentPhone]
                    );
                    currentJudge = { id: newJudge.rows[0].id, name: name };
                    totalJudges++;
                    console.log(`Processing Judge: ${name}`);
                } catch (e) { console.log('Judge Insert Error:', e.message); }
                continue;
            }
        }

        await client.query('COMMIT');
        console.log(`✅ Import Complete: ${totalJudges} Judges, ${totalEvents} Events.`);

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Import Failed:', e);
    } finally {
        client.release();
        await db.pool.end();
    }
}

importData();
