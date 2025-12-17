
const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function updateTeamsSchema() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        // 1. Add password_hash column if it doesn't exist
        console.log('Checking/Adding password_hash column...');
        await client.query(`
            ALTER TABLE teams 
            ADD COLUMN IF NOT EXISTS password_hash TEXT;
        `);
        console.log('Column password_hash ensured.');

        if (true) { // Force update for debugging
            console.log('Forcing password update for Team 100...');
            const hash100 = await bcrypt.hash('100', 10);
            await client.query("UPDATE teams SET password_hash = $1 WHERE code = '100'", [hash100]);
            console.log('Team 100 password reset to 100.');
        }

        // 2. Seed passwords for existing teams
        console.log('Fetching teams...');
        const { rows: teams } = await client.query('SELECT code, password_hash FROM teams');

        for (const team of teams) {
            if (!team.password_hash && team.code !== '100') { // Skip 100 as done
                console.log(`Setting password for team ${team.code}...`);
                // Default password is the team code itself
                const hash = await bcrypt.hash(team.code, 10);
                await client.query('UPDATE teams SET password_hash = $1 WHERE code = $2', [hash, team.code]);
            }
        }
        console.log('All teams have passwords.');

    } catch (err) {
        console.error('Update failed:', err);
    } finally {
        await client.end();
    }
}

if (require.main === module) {
    updateTeamsSchema();
}
