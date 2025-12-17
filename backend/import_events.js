const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function importEvents() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        const csvPath = path.join(__dirname, 'events_to_import.csv');
        let csvData = fs.readFileSync(csvPath, 'utf8');

        if (csvData.charCodeAt(0) === 0xFEFF) {
            csvData = csvData.slice(1);
        }

        const lines = csvData.split('\n').filter(line => line.trim() !== '');
        const dataLines = lines.slice(1);

        console.log(`Found ${dataLines.length} events to import.`);

        let successCount = 0;
        let failCount = 0;

        for (const line of dataLines) {
            const cols = line.split(';');
            if (cols.length < 10) continue;

            let id = cols[0].trim();
            const originalId = id;
            id = id.replace(/[^a-f0-9-]/gi, '');

            const name = cols[1].trim();
            const code = cols[2].trim();
            const category = cols[3].trim();
            const eventTypeRaw = cols[4].trim();
            const statusRaw = cols[6].trim();
            const stageTypeRaw = cols[9].trim();

            const itemType = eventTypeRaw.charAt(0).toUpperCase() + eventTypeRaw.slice(1);
            const status = statusRaw === 'upcoming' ? 'Pending' : 'Pending';

            let eventType = 'Offstage';
            if (stageTypeRaw.toLowerCase().includes('on_stage')) {
                eventType = 'Onstage';
            } else if (stageTypeRaw.toLowerCase().includes('off_stage')) {
                eventType = 'Offstage';
            }

            // Debug log for the first item
            if (failCount === 0 && successCount === 0) {
                console.log(`Attempting to insert: ID=${id} (len=${id.length}), Name=${name}`);
                console.log(`Original ID: "${originalId}"`);
            }

            try {
                await client.query(
                    `INSERT INTO events (id, code, name, event_type, item_type, category, status) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7)
                     ON CONFLICT (code) DO UPDATE SET
                        name = EXCLUDED.name,
                        event_type = EXCLUDED.event_type,
                        item_type = EXCLUDED.item_type,
                        category = EXCLUDED.category,
                        status = EXCLUDED.status`,
                    [id, code, name, eventType, itemType, category, status]
                );
                successCount++;
            } catch (err) {
                console.error(`Failed to import ${name}:`, err.message);
                // console.error('Full error:', err);
                failCount++;
            }
        }

        console.log(`Import completed. Success: ${successCount}, Failed: ${failCount}`);

    } catch (err) {
        console.error('Import failed:', err);
    } finally {
        await client.end();
    }
}

importEvents();
