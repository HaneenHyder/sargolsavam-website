const { Client } = require('pg');
require('dotenv').config();

async function verifyDeletion() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        const res = await client.query('SELECT COUNT(*) FROM events');
        const count = parseInt(res.rows[0].count);

        if (count === 0) {
            console.log('Verification Successful: No events found in the database.');
        } else {
            console.error(`Verification Failed: Found ${count} events in the database.`);
            process.exit(1);
        }

    } catch (err) {
        console.error('Error verifying deletion:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

verifyDeletion();
