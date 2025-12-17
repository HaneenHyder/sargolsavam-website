const db = require('./src/db');
const resultsController = require('./src/controllers/resultsController');

const req = {};
const res = {
    json: function (data) {
        console.log('Results count:', data.length);
        const groupResults = data.filter(r => r.event_name && r.event_name.includes('Test Group Event'));
        console.log('Group Event Results:', groupResults);
        return this;
    },
    status: function (code) {
        console.log('Status:', code);
        return this;
    }
};

async function debugGetResults() {
    try {
        console.log('Querying participants directly for Test Group Event...');
        const { rows: events } = await db.query("SELECT * FROM events WHERE name ILIKE '%Test Group Event%'");
        if (events.length > 0) {
            const eventId = events[0].id;
            console.log('Event ID:', eventId);
            const { rows: participants } = await db.query('SELECT * FROM participants WHERE event_id = $1', [eventId]);
            console.log('Participants:', participants);
        }

        await resultsController.getResults(req, res);
    } catch (err) {
        console.error('Error:', err);
    }
}

debugGetResults();
