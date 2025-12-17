const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function fixSchema() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        // Drop tables with CASCADE
        console.log('Dropping tables...');
        await client.query('DROP TABLE IF EXISTS participants CASCADE');
        await client.query('DROP TABLE IF EXISTS events CASCADE');
        await client.query('DROP TABLE IF EXISTS candidates CASCADE');
        await client.query('DROP TABLE IF EXISTS teams CASCADE');
        await client.query('DROP TABLE IF EXISTS appeals CASCADE'); // Drop appeals too just in case

        // Recreate tables from init.sql
        const sqlPath = path.join(__dirname, 'migrations', 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Re-running init.sql...');
        await client.query(sql);

        // Also run create_appeals_table.sql
        const appealsSqlPath = path.join(__dirname, 'migrations', 'create_appeals_table.sql');
        if (fs.existsSync(appealsSqlPath)) {
            const appealsSql = fs.readFileSync(appealsSqlPath, 'utf8');
            console.log('Re-running create_appeals_table.sql...');
            await client.query(appealsSql);
        }

        console.log('Schema fixed successfully.');

    } catch (err) {
        console.error('Error fixing schema:', err);
    } finally {
        await client.end();
    }
}

fixSchema();
