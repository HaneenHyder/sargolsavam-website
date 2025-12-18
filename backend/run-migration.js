const db = require('./src/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    console.log('🚀 Running schedule migration...');

    try {
        const migrationPath = path.join(__dirname, 'migrations', 'create_schedule_tables.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        await db.query(sql);
        console.log('✅ Migration complete!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await db.pool.end();
    }
}

runMigration();
