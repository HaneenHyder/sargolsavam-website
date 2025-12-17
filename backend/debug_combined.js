const db = require('./src/db');
const resultsController = require('./src/controllers/resultsController');

const req = { body: { results: [] } };
const res = {
    status: (c) => ({ json: (d) => console.log(`Status ${c} JSON:`, d) }),
    json: (d) => console.log('JSON:', d)
};

async function debugCombined() {
    try {
        console.log('--- START ---');
        const { rows: events } = await db.query("SELECT * FROM events WHERE name ILIKE '%Test Group Event%'");
        if (events.length === 0) { console.log('No event found'); return; }

        const event = events[0];
        console.log(`Event: ${event.id} - ${event.name} (${event.item_type})`);

        // 1. Check participants
        let { rows: parts } = await db.query('SELECT * FROM participants WHERE event_id = $1', [event.id]);
        console.log(`Participants before: ${parts.length}`);
        parts.forEach(p => console.log(` - P: ${p.id}, Team: ${p.team_code}, Status: ${p.status}`));

        if (parts.length === 0) {
            console.log('Inserting participants...');
            const teams = ['100', '200', '300'];
            for (const teamCode of teams) {
                await db.query('INSERT INTO participants (event_id, team_code, status) VALUES ($1, $2, $3)', [event.id, teamCode, 'Pending']);
            }
            parts = (await db.query('SELECT * FROM participants WHERE event_id = $1', [event.id])).rows;
            console.log(`Participants after insert: ${parts.length}`);
        }

        // 2. Add Results
        req.body.results = [
            { event_id: event.id, candidate_id: null, team_code: '100', position: '1', grade: 'A' }
        ];
        console.log('Adding results...');
        await resultsController.addResults(req, res);

        // 3. Check participants again
        parts = (await db.query('SELECT * FROM participants WHERE event_id = $1', [event.id])).rows;
        console.log(`Participants after update:`);
        parts.forEach(p => console.log(` - P: ${p.id}, Team: ${p.team_code}, Pos: ${p.position}, Grade: ${p.grade}`));

        // 4. Check getResults
        console.log('Calling getResults...');
        const resGet = {
            json: (data) => {
                const filtered = data.filter(r => r.event_id === event.id);
                console.log(`getResults returned ${filtered.length} rows for this event.`);
                console.log(filtered);
            },
            status: (c) => ({ json: (d) => console.error(d) })
        };
        await resultsController.getResults({}, resGet);

    } catch (err) {
        console.error(err);
    }
}

debugCombined();
