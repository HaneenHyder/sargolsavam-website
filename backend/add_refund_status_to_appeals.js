const { pool } = require('./src/db');

async function addColumn() {
    try {
        console.log('Adding refund_status column to appeals table...');

        await pool.query(`
        ALTER TABLE appeals 
        ADD COLUMN IF NOT EXISTS refund_status VARCHAR(50);
    `);

        console.log('Successfully added refund_status column');

    } catch (err) {
        console.error('Error altering table:', err.message);
    } finally {
        await pool.end();
    }
}

addColumn();
