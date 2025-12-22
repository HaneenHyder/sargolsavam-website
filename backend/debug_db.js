require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.SUPABASE_URL || process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
});

async function run() {
    try {
        console.log('🔌 Connecting...');
        // Enable extension
        console.log('🔧 Enabling uuid-ossp...');
        await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        console.log('✅ Extension enabled.');

        // Create table
        console.log('🏗️ Creating table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS committee_members (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(100) NOT NULL,
                role VARCHAR(100) NOT NULL,
                department VARCHAR(100),
                email VARCHAR(100),
                phone VARCHAR(20),
                image TEXT,
                instagram TEXT
            );
        `);
        console.log('✅ Table created.');

        // Check existence
        const res = await pool.query("SELECT to_regclass('public.committee_members')");
        console.log('🔍 Table check:', res.rows[0]);

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await pool.end();
    }
}

run();
