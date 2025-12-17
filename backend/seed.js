const runMigration = require('./migrate');
const seedCandidates = require('./seed-candidates');
const db = require('./src/db');

async function seed() {
    console.log('🌱 Starting Seed Process...');

    try {
        console.log('\n--- Running Migrations ---');
        await runMigration();

        console.log('\n--- Seeding Candidates ---');
        await seedCandidates();

        const seedCommittee = require('./seed-committee');
        console.log('\n--- Seeding Committee ---');
        await seedCommittee();

        console.log('\n✅ Seed Process Completed Successfully!');
    } catch (err) {
        console.error('\n❌ Seed Process Failed:', err);
        process.exit(1);
    } finally {
        // Close DB connection if pool is active
        // db.pool.end(); // migrate.js creates its own client, seed-candidates uses db module.
        // We need to ensure db module pool is closed.
        await db.pool.end();
    }
}

seed();
