require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Allow local execution to verify DB URL
const connectionString = process.env.SUPABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ Error: SUPABASE_URL or DATABASE_URL is not defined in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

const COMMITTEE_JSON_PATH = path.join(__dirname, '../frontend/content/committee.json');
const MIGRATION_PATH = path.join(__dirname, 'migrations/add_committee_members.sql');

async function seed(externalClient) {
    try {
        if (externalClient) {
            console.log('Using shared DB client for committee...');
        } else {
            console.log('🔌 Connecting to database...');
        }
        const client = externalClient || await pool.connect();

        try {
            console.log('🏗️ Running migration (Creating table if needed)...');
            const migrationSql = fs.readFileSync(MIGRATION_PATH, 'utf8');
            await client.query(migrationSql);
            console.log('✅ Migration applied.');

            console.log('🧹 Clearing existing committee members...');
            await client.query('DELETE FROM committee_members');

            console.log('📖 Reading committee.json...');
            const committeeData = JSON.parse(fs.readFileSync(COMMITTEE_JSON_PATH, 'utf8'));

            console.log(`🌱 Seeding ${committeeData.length} members...`);

            for (const member of committeeData) {
                // Determine 'image' field (some are empty strings)
                const imagePath = member.image || null;

                // Insert
                await client.query(
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
                    ]
                );
            }

            console.log('✅ DONE! Committee members seeded successfully.');

        } finally {
            if (!externalClient) {
                client.release();
            }
        }
    } catch (err) {
        console.error('❌ Error seeding data:', err);
    } finally {
        if (!externalClient) {
            await pool.end();
        }
    }
}

module.exports = seed;

if (require.main === module) {
    seed();
}
