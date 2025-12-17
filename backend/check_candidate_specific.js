const { pool } = require('./src/db');

async function checkCandidate() {
    try {
        const idToCheck = '72de39a6-494d-449d-876f-14b121863f3f';
        const checkRes = await pool.query('SELECT * FROM candidates WHERE id = $1', [idToCheck]);
        console.log(`Candidate ${idToCheck} found:`, checkRes.rows.length > 0);

        const listRes = await pool.query('SELECT id, name FROM candidates LIMIT 5');
        console.log('Sample candidates:', listRes.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkCandidate();
