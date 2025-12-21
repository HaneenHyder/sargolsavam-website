const db = require('./src/db');
const fs = require('fs');
const path = require('path');

const migrationFile = process.argv[2];

if (!migrationFile) {
    console.error('❌ Please provide a migration filename (e.g., myscript.sql)');
    process.exit(1);
}

async function runMigration() {
    console.log(`🚀 Running migration: ${migrationFile}...`);

    try {
        const migrationPath = path.join(__dirname, 'migrations', migrationFile);

        if (!fs.existsSync(migrationPath)) {
            console.error(`❌ File not found: ${migrationPath}`);
            process.exit(1);
        }

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
