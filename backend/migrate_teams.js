const db = require('./src/db');
const bcrypt = require('bcrypt');

async function migrateTeams() {
    try {
        console.log('Adding password_hash to teams table...');
        await db.query(`ALTER TABLE teams ADD COLUMN IF NOT EXISTS password_hash TEXT;`);

        const teams = [
            { code: '100', password: 'TeamA@100' },
            { code: '200', password: '200_BmaeT' },
            { code: '300', password: 'tEam#3C00' }
        ];

        for (const team of teams) {
            const hash = await bcrypt.hash(team.password, 10);
            await db.query('UPDATE teams SET password_hash = $1 WHERE code = $2', [hash, team.code]);
            console.log(`Updated password for team ${team.code}`);
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrateTeams();
