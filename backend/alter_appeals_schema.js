const { pool } = require('./src/db');

async function alterTable() {
    try {
        console.log('Altering appeals table...');
        // We need to drop the column and recreate it, or alter type.
        // Since it might have data (though unlikely valid), let's try altering.
        // UUID to VARCHAR is safe.

        await pool.query(`
        ALTER TABLE appeals 
        ALTER COLUMN submitted_by TYPE VARCHAR(255);
    `);

        console.log('Successfully altered submitted_by to VARCHAR(255)');

    } catch (err) {
        console.error('Error altering table:', err.message);
    } finally {
        await pool.end();
    }
}

alterTable();
