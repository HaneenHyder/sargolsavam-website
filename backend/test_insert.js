const { Client } = require('pg');
require('dotenv').config();

async function testInsert() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        const id = 'add73c38-1d4a-4d6d-8cb4-0d07c1866201';
        const code = 'test-code-123';
        const name = 'Test Event';
        const eventType = 'Offstage';
        const itemType = 'Individual';
        const category = 'senior';
        const status = 'Pending';

        console.log(`Attempting hardcoded insert with ID: ${id}`);

        await client.query(
            `INSERT INTO events (id, code, name, event_type, item_type, category, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [id, code, name, eventType, itemType, category, status]
        );

        console.log('Hardcoded insert successful!');

    } catch (err) {
        console.error('Hardcoded insert failed:', err.message);
    } finally {
        await client.end();
    }
}

testInsert();
