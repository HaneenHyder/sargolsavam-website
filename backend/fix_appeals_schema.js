const db = require('./src/db');

async function fixSchema() {
    try {
        console.log('Altering appeals table...');
        await db.query('ALTER TABLE appeals ALTER COLUMN submitted_by TYPE TEXT;');
        console.log('Schema updated successfully.');
    } catch (err) {
        console.error('Error updating schema:', err);
    } finally {
        process.exit();
    }
}

fixSchema();
