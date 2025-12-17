const db = require('./src/db');

async function getTeam() {
    try {
        const res = await db.query('SELECT code FROM teams LIMIT 1');
        console.log('Team Code:', res.rows[0].code);
    } catch (err) {
        console.error('Error fetching team:', err);
    } finally {
        process.exit();
    }
}

getTeam();
