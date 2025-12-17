const db = require('./src/db');

async function dumpData() {
    try {
        console.log('--- Appeals ---');
        const appeals = await db.query('SELECT id, submitted_by, submitted_by_role FROM appeals ORDER BY created_at DESC LIMIT 5');
        console.log(JSON.stringify(appeals.rows, null, 2));

        console.log('\n--- Teams ---');
        const teams = await db.query('SELECT id, code, name FROM teams LIMIT 5');
        console.log(JSON.stringify(teams.rows, null, 2));

        console.log('\n--- Candidates ---');
        const candidates = await db.query('SELECT id, chest_no, name FROM candidates LIMIT 5');
        console.log(JSON.stringify(candidates.rows, null, 2));

    } catch (err) {
        console.error('Error dumping data:', err);
    } finally {
        process.exit();
    }
}

dumpData();
