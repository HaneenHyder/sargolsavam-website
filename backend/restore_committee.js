require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.SUPABASE_URL || process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000, // Increased timeout
    idleTimeoutMillis: 20000
});

const COMMITTEE_JSON_PATH = path.join(__dirname, '../frontend/content/committee.json');
const MIGRATION_PATH = path.join(__dirname, 'migrations/add_committee_members.sql');

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeWithRetry(client, query, params = [], retries = 5, label = 'Query') {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await client.query(query, params);
            return res;
        } catch (err) {
            console.log(`⚠️ ${label} attempt ${i + 1} failed: ${err.message}`);
            if (i === retries - 1) throw err;
            await wait(2000 * (i + 1));
        }
    }
}

async function restore() {
    let client;
    try {
        console.log('🔌 Connecting to database...');
        client = await pool.connect();

        // 1. Create Table
        console.log('🏗️ Ensuring table exists...');
        const migrationSql = fs.readFileSync(MIGRATION_PATH, 'utf8');
        // We can't easily check for existence in a generic way that works for creation without just running the "CREATE TABLE IF NOT EXISTS"
        // The SQL file has "CREATE TABLE IF NOT EXISTS", so running it is safe.
        // But first, let's just try running the migration SQL.
        await executeWithRetry(client, migrationSql, [], 5, 'Create Table');
        console.log('✅ Table schema applied.');

        // 2. Clear Data
        console.log('🧹 Clearing existing data...');
        await executeWithRetry(client, 'DELETE FROM committee_members', [], 5, 'Delete Data');

        // 3. Seed Data
        console.log('📖 Reading committee.json...');
        const committeeData = JSON.parse(fs.readFileSync(COMMITTEE_JSON_PATH, 'utf8'));
        console.log(`🌱 Seeding ${committeeData.length} members...`);

        for (const member of committeeData) {
            const imagePath = member.image || null;
            await executeWithRetry(client,
                `INSERT INTO committee_members (name, role, department, email, phone, image, instagram)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    member.name,
                    member.role,
                    member.department,
                    member.email,
                    member.phone,
                    imagePath,
                    member.instagram || null
                ],
                3, // 3 retries per insert
                `Insert ${member.name}`
            );
            console.log(`   - Inserted ${member.name}`);
        }

        console.log('✅ DONE! Committee members restored successfully.');

    } catch (err) {
        console.error('❌ Error restoring data:', err);
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

restore();
