const db = require('./src/db');
const fs = require('fs');

async function checkEventStatus() {
    const output = {};
    try {
        console.log("Checking Events Status...");
        const events = await db.query("SELECT id, name, status FROM events WHERE status = 'Declared'");
        output.declared_events = events.rows;

        if (events.rows.length > 0) {
            const eventId = events.rows[0].id;
            console.log(`\nChecking Participants for Event ${eventId} (${events.rows[0].name})...`);
            const participants = await db.query(
                "SELECT id, candidate_id, status, position, grade FROM participants WHERE event_id = $1",
                [eventId]
            );
            output.participants = participants.rows;
        }
        fs.writeFileSync('event_status.json', JSON.stringify(output, null, 2));
    } catch (err) {
        console.error("Error:", err);
        fs.writeFileSync('event_status.json', JSON.stringify({ error: err.message }, null, 2));
    } finally {
        process.exit();
    }
}

checkEventStatus();
