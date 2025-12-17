const { pool } = require('./src/db');

async function checkEvent() {
    try {
        const idToCheck = 'add73c38-1d4a-4d6d-8cb4-0d07c1866201';
        const checkRes = await pool.query('SELECT * FROM events WHERE id = $1', [idToCheck]);
        console.log(`Event ${idToCheck} found:`, checkRes.rows.length > 0);
        if (checkRes.rows.length > 0) {
            console.log('Event name:', checkRes.rows[0].name);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkEvent();
