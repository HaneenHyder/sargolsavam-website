const db = require('./src/db');

async function checkJudges() {
    try {
        const { rows } = await db.query('SELECT count(*) FROM judges');
        console.log(`Judges count: ${rows[0].count}`);

        const { rows: judges } = await db.query('SELECT * FROM judges LIMIT 5');
        console.log('Sample Judges:', judges);
    } catch (err) {
        console.error('Error checking judges:', err);
    } finally {
        await db.pool.end();
    }
}

checkJudges();
