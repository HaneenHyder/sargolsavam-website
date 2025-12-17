const db = require('./src/db');

async function debugGroupEvent() {
    try {
        console.log('Searching for "Test Group Event"...');
        const { rows: events } = await db.query("SELECT * FROM events WHERE name ILIKE '%Test Group Event%'");

        if (events.length === 0) {
            console.log('Event not found.');
            return;
        }

        const event = events[0];
        console.log('Event found:', event);

        // Check participants
        const { rows: participants } = await db.query('SELECT * FROM participants WHERE event_id = $1', [event.id]);
        console.log(`Participants count: ${participants.length}`);
        console.log('Participants:', participants);

        if (participants.length === 0) {
            console.log('WARNING: No participants found for this Group Event!');
        }

        // Attempt to publish results (simulate empty results if no participants)
        console.log('Attempting to publish results...');

        // We need to simulate the controller logic roughly
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('UPDATE events SET status = \'Declared\' WHERE id = $1', [event.id]);
            await client.query('COMMIT');
            console.log('Publish query executed successfully.');
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Publish query FAILED:', err);
        } finally {
            client.release();
        }

        // Check status again
        const { rows: updatedEvents } = await db.query('SELECT * FROM events WHERE id = $1', [event.id]);
        console.log('Updated Event Status:', updatedEvents[0].status);

    } catch (err) {
        console.error('Error:', err);
    }
}

debugGroupEvent();
