const db = require('./src/db');

async function checkColumns() {
    try {
        const res = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'committee_members'");
        console.log('Columns:', res.rows.map(r => r.column_name));
    } catch (err) {
        console.error(err);
    }
}

checkColumns();
