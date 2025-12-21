const fs = require('fs');
const csv = require('csv-parser');
const db = require('./src/db');

const CSV_FILE_PATH = 'C:\\Users\\Ahsan Malik\\Downloads\\Book3.csv';

async function importSchedule() {
    console.log(`🚀 Starting import from ${CSV_FILE_PATH}...`);

    if (!fs.existsSync(CSV_FILE_PATH)) {
        console.error('❌ File not found!');
        process.exit(1);
    }

    const results = [];
    fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv({ headers: false }))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            console.log(`📊 Found ${results.length} rows. Processing...`);

            const client = await db.pool.connect();
            try {
                await client.query('BEGIN');

                let importedCount = 0;
                for (const row of results) {
                    // Check if required fields exist
                    // CSV headers might be slightly different, let's log the first row keys
                    if (importedCount < 5) {
                        console.log(`Row ${importedCount}:`, JSON.stringify(row));
                    }

                    // Map by Index
                    // 0: JudgeName
                    // 1: Phone
                    // 2: Day
                    // 3: Date
                    // 4: Event
                    // 5: Category
                    // 6: Stage
                    // 7: Time

                    const judgeName = row[0];
                    const phone = row[1];
                    const day = row[2];
                    const dateRaw = row[3];
                    const eventName = row[4];
                    const category = row[5];
                    const stage = row[6];
                    const time = row[7];

                    if (!judgeName || !phone) {
                        console.log('⚠️ Skipping row due to missing name/phone:', row);
                        continue;
                    }

                    // 1. Insert/Get Judge
                    let judgeRes = await client.query(
                        'SELECT id FROM whatsapp_judges WHERE whatsapp_number = $1',
                        [phone]
                    );

                    let judgeId;
                    if (judgeRes.rows.length === 0) {
                        const newJudge = await client.query(
                            'INSERT INTO whatsapp_judges (name, whatsapp_number) VALUES ($1, $2) RETURNING id',
                            [judgeName, phone]
                        );
                        judgeId = newJudge.rows[0].id;
                    } else {
                        judgeId = judgeRes.rows[0].id;
                    }

                    let dateVal = null;
                    if (dateRaw) {
                        try {
                            // Try parsing manually if needed, or simple new Date
                            const d = new Date(dateRaw);
                            if (!isNaN(d.getTime())) {
                                dateVal = d;
                            }
                        } catch (e) { }
                    }

                    // 2. Insert Schedule
                    await client.query(
                        'INSERT INTO whatsapp_judge_schedules (judge_id, day, date, event_name, category, stage, time) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                        [
                            judgeId,
                            day || 'TBD',
                            dateVal,
                            eventName,
                            category,
                            stage,
                            time
                        ]
                    );
                    importedCount++;
                }

                await client.query('COMMIT');
                console.log(`✅ Successfully imported ${importedCount} schedule items!`);
            } catch (e) {
                await client.query('ROLLBACK');
                console.error('❌ Import failed:', e.message);
                console.error('Full Error:', e);
            } finally {
                client.release();
                await db.pool.end();
            }
        });
}

importSchedule();
