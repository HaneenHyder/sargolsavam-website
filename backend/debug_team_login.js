const { pool } = require('./src/db');
const bcrypt = require('bcrypt');

async function debugLogin() {
    try {
        const code = '100';
        const password = 'password';

        console.log(`Checking login for team code: ${code}`);

        const { rows } = await pool.query('SELECT * FROM teams WHERE code = $1', [code]);

        if (rows.length === 0) {
            console.log('Team not found');
            return;
        }

        const team = rows[0];
        console.log('Team found:', team.name);
        console.log('Stored Hash:', team.password_hash);

        if (!team.password_hash) {
            console.log('Error: No password hash found for team');
            return;
        }

        const match = await bcrypt.compare(password, team.password_hash);
        console.log(`Password '${password}' match result:`, match);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

debugLogin();
