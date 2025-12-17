const db = require('./src/db');

async function checkCandidates() {
    try {
        const res = await db.query('SELECT COUNT(*) FROM candidates');
        console.log('Candidates count:', res.rows[0].count);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkCandidates();
