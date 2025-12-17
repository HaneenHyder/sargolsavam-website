const db = require('./src/db');
const resultsController = require('./src/controllers/resultsController');

// Mock request and response
const req = {
    body: {
        results: []
    }
};

const res = {
    status: function (code) {
        console.log('Response Status:', code);
        return this;
    },
    json: function (data) {
        console.log('Response JSON:', data);
        return this;
    }
};

async function debugAddResults() {
    try {
        console.log('Searching for "Test Group Event"...');
        const { rows: events } = await db.query("SELECT * FROM events WHERE name ILIKE '%Test Group Event%'");

        if (events.length === 0) {
            console.log('Event not found.');
            return;
        }

        const event = events[0];
        console.log('Event found:', event.id, event.name);

        // Construct payload
        req.body.results = [
            {
                event_id: event.id,
                candidate_id: null,
                team_code: '100',
                position: '1',
                grade: 'A'
            },
            {
                event_id: event.id,
                candidate_id: null,
                team_code: '200',
                position: '2',
                grade: 'B'
            }
        ];

        console.log('Calling addResults with payload:', req.body.results);
        await resultsController.addResults(req, res);

    } catch (err) {
        console.error('Error:', err);
    }
}

debugAddResults();
