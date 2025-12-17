const { pool } = require('./src/db');

async function addColumn() {
    try {
        console.log('Adding updated_at column to appeals table...');

        await pool.query(`
        ALTER TABLE appeals 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

        console.log('Successfully added updated_at column');

    } catch (err) {
        console.error('Error altering table:', err.message);
    } finally {
        await pool.end();
    }
}

addColumn();
