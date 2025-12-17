const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function resetPassword() {
    try {
        const password = 'admin123';
        const hash = await bcrypt.hash(password, 10);
        console.log('Generated Hash:', hash);

        const res = await pool.query(
            `UPDATE admins SET password_hash = $1 WHERE username = 'admin' RETURNING *`,
            [hash]
        );

        if (res.rows.length > 0) {
            console.log('✅ Password updated successfully for user:', res.rows[0].username);
        } else {
            console.log('❌ User "admin" not found. Creating it...');
            await pool.query(
                `INSERT INTO admins (username, password_hash, role) VALUES ('admin', $1, 'admin')`,
                [hash]
            );
            console.log('✅ User "admin" created with new password.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
}

resetPassword();
