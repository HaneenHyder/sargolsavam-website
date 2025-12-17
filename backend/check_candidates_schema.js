const { Client } = require('pg');
require('dotenv').config();

async function checkCandidatesSchema() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'candidates';
        `);

        console.log('Candidates Table Schema:');
        res.rows.forEach(row => {
            console.log(`${row.column_name}: ${row.data_type}`);
        });

    } catch (err) {
        console.error('Error checking schema:', err);
    } finally {
        await client.end();
    }
}

checkCandidatesSchema();
