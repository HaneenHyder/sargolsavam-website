const { pool } = require('./src/db');
const bcrypt = require('bcrypt');

async function updatePassword() {
    try {
        const code = '100';
        const newPassword = 'TeamA@100';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        console.log(`Updating password for team ${code} to ${newPassword}...`);

        await pool.query('UPDATE teams SET password_hash = $1 WHERE code = $2', [hash, code]);

        console.log('Successfully updated password');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

updatePassword();
