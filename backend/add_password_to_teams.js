const { pool } = require('./src/db');
const bcrypt = require('bcryptjs');

async function addPasswordColumn() {
    try {
        console.log('Adding password_hash column to teams table...');

        await pool.query(`
        ALTER TABLE teams 
        ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    `);

        console.log('Successfully added password_hash column');

        // Update existing teams with a default password 'password'
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password', salt);

        console.log('Updating existing teams with default password...');
        await pool.query('UPDATE teams SET password_hash = $1 WHERE password_hash IS NULL', [hash]);

        console.log('Successfully updated teams with default password');

    } catch (err) {
        console.error('Error altering table:', err.message);
    } finally {
        await pool.end();
    }
}

addPasswordColumn();
