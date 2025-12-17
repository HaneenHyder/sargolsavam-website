const db = require('./src/db');

async function checkCommittee() {
    try {
        const result = await db.query('SELECT * FROM committee_members');
        console.log(`Found ${result.rows.length} committee members.`);
        if (result.rows.length > 0) {
            console.log('First member:', result.rows[0]);
        }
    } catch (err) {
        console.error('Error querying committee members:', err);
    } finally {
        await db.pool.end();
    }
}

checkCommittee();
