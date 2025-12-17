const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./src/db');

async function migrate() {
    console.log('Starting migration...');
    try {
        // 1. Drop old columns
        await db.query('ALTER TABLE candidates DROP COLUMN IF EXISTS "class"');
        await db.query('ALTER TABLE candidates DROP COLUMN IF EXISTS "contact"');
        console.log('Dropped class and contact columns.');

        // 2. Rename division to category in candidates
        try {
            await db.query('ALTER TABLE candidates RENAME COLUMN division TO category');
            console.log('Renamed candidates.division to category.');
        } catch (e) {
            console.log('Skipping candidates.division rename (might already exist or be renamed):', e.message);
        }

        // 3. Rename division to category in events
        try {
            await db.query('ALTER TABLE events RENAME COLUMN division TO category');
            console.log('Renamed events.division to category.');
        } catch (e) {
            console.log('Skipping events.division rename (might already exist or be renamed):', e.message);
        }

        // 4. Add role column
        await db.query('ALTER TABLE candidates ADD COLUMN IF NOT EXISTS role VARCHAR(50)');
        console.log('Added role column.');

        console.log('Migration complete.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit();
    }
}

migrate();
