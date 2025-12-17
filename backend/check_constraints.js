const db = require('./src/db');

async function checkConstraints() {
    try {
        const res = await db.query(`
            SELECT constraint_name, constraint_type
            FROM information_schema.table_constraints
            WHERE table_name = 'appeals';
        `);
        console.log('Appeals Constraints:', res.rows);
    } catch (err) {
        console.error('Error checking constraints:', err);
    } finally {
        process.exit();
    }
}

checkConstraints();
