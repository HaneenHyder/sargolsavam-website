const db = require('./src/db');

async function checkGroupPoints() {
    try {
        const fs = require('fs');
        let output = '';
        const log = (msg) => { console.log(msg); output += msg + '\n'; };

        log('--- Checking Group Event Points ---');

        // 1. Create a dummy Group Event
        const eventCode = 'GRP' + Math.floor(Math.random() * 1000);
        const eventRes = await db.query(
            "INSERT INTO events (code, name, event_type, item_type, category, status) VALUES ($1, 'Test Group Event', 'Onstage', 'Group', 'General', 'Declared') RETURNING *",
            [eventCode]
        );
        const event = eventRes.rows[0];
        log(`Created Event: ${event.name} ${event.id}`);

        // 2. Add a result for Team 100
        const teamCode = '100';
        await db.query(
            "INSERT INTO participants (event_id, team_code, status, position, grade, points) VALUES ($1, $2, 'Winner', 1, 'A', 20)",
            [event.id, teamCode]
        );
        log('Added Result for Team 100: 1st Place, Grade A, 20 Points');

        // 3. Run the query from teamController.js
        const resultsResult = await db.query(`
            SELECT r.id, r.event_id, r.candidate_id, r.position, r.grade, r.points, r.status,
                   e.name as event_name, e.event_type, e.item_type,
                   c.chest_no, c.name as candidate_name
            FROM participants r
            JOIN events e ON r.event_id = e.id
            LEFT JOIN candidates c ON r.candidate_id = c.id
            WHERE r.team_code = $1 AND r.status = 'Winner' AND e.status = 'Declared'
            ORDER BY e.name
        `, [teamCode]);

        log(`Query Results Count: ${resultsResult.rows.length}`);
        log(`Query Results: ${JSON.stringify(resultsResult.rows, null, 2)}`);

        // 4. Calculate Total Points
        let totalPoints = 0;
        resultsResult.rows.forEach(r => {
            totalPoints += (r.points || 0);
        });
        log(`Calculated Total Points: ${totalPoints}`);

        if (resultsResult.rows.some(r => r.event_id === event.id) && totalPoints >= 20) {
            log('SUCCESS: Group event result found and points counted.');
        } else {
            log('FAILURE: Group event result not found or points not counted.');
        }

        fs.writeFileSync('check_output.txt', output);

        // Cleanup
        await db.query('DELETE FROM participants WHERE event_id = $1', [event.id]);
        await db.query('DELETE FROM events WHERE id = $1', [event.id]);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

checkGroupPoints();
