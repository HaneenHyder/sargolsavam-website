const { pool } = require('./src/db');

async function checkCandidates() {
    try {
        const candidatesCount = await pool.query('SELECT COUNT(*) FROM candidates');
        console.log('Total candidates:', candidatesCount.rows[0].count);

        const teamsCount = await pool.query('SELECT COUNT(*) FROM teams');
        console.log('Total teams:', teamsCount.rows[0].count);

        const eventsCount = await pool.query('SELECT COUNT(*) FROM events');
        console.log('Total events:', eventsCount.rows[0].count);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkCandidates();
