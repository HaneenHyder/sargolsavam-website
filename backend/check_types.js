const db = require('./src/db');

async function checkTypes() {
    try {
        const teamsRes = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'teams' AND column_name = 'id';
        `);
        console.log('Teams ID Type:', teamsRes.rows[0]);

        const appealsRes = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'appeals' AND column_name = 'submitted_by';
        `);
        console.log('Appeals SubmittedBy Type:', appealsRes.rows[0]);

    } catch (err) {
        console.error('Error checking types:', err);
    } finally {
        process.exit();
    }
}

checkTypes();
