const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runJudgesMigration() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        const sqlPath = path.join(__dirname, 'migrations', 'create_judges_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running judges migration...');
        await client.query(sql);
        console.log('Judges migration successful!');

    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await client.end();
    }
}

runJudgesMigration();
