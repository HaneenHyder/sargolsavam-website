const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./src/db');

async function seedCandidates() {
    const csvPath = path.join(__dirname, 'imports', 'candidates.csv');
    if (!fs.existsSync(csvPath)) {
        console.error('CSV file not found:', csvPath);
        process.exit(1);
    }

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');

    // Headers: category ,team_code ,chest_no ,name ,role 
    // Skip header
    const dataLines = lines.slice(1);

    console.log(`Found ${dataLines.length} candidates to seed...`);

    let added = 0;
    let errors = 0;

    for (const line of dataLines) {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length < 4) continue;

        // category ,team_code ,chest_no ,name ,role 
        const category = parts[0];
        const team_code = parts[1];
        const chest_no = parts[2];
        const name = parts[3];
        const role = parts[4] || 'Participant';

        try {
            await db.query(
                `INSERT INTO candidates (chest_no, name, team_code, category, role)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (chest_no) 
                 DO UPDATE SET name = EXCLUDED.name, team_code = EXCLUDED.team_code, category = EXCLUDED.category, role = EXCLUDED.role`,
                [chest_no, name, team_code, category, role]
            );
            added++;
        } catch (err) {
            console.error(`Error adding ${chest_no}: ${err.message}`);
            errors++;
        }
    }

    console.log(`Seeding complete. Added/Updated: ${added}, Errors: ${errors}`);
    console.log(`Seeding complete. Added/Updated: ${added}, Errors: ${errors}`);
    // process.exit(0); // Removed to allow chaining
}

if (require.main === module) {
    seedCandidates();
}

module.exports = seedCandidates;
