const { Client } = require('pg');
require('dotenv').config();

async function deleteAllEvents() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        // Delete participants first due to FK constraint
        console.log('Deleting all participants...');
        const participantsResult = await client.query('DELETE FROM participants');
        console.log(`Deleted ${participantsResult.rowCount} participants.`);

        // Delete events
        console.log('Deleting all events...');
        const eventsResult = await client.query('DELETE FROM events');
        console.log(`Deleted ${eventsResult.rowCount} events.`);

        console.log('All events and participants deleted successfully.');

    } catch (err) {
        console.error('Error deleting events:', err);
    } finally {
        await client.end();
    }
}

deleteAllEvents();
