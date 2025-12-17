const fs = require('fs');
const path = require('path');
const db = require('./src/db');

async function seedCommittee() {
    console.log('🌱 Seeding Committee Members...');

    try {
        const jsonPath = path.join(__dirname, '../frontend/content/committee.json');
        const committeeData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

        // Clear existing data to avoid duplicates (optional, but good for re-seeding)
        // await db.query('DELETE FROM committee_members'); 
        // Better to use ON CONFLICT if we had a unique constraint, but we don't.
        // For now, let's just insert. If we want idempotency, we should check existence.
        // Let's truncate for clean slate on seed.
        await db.query('TRUNCATE TABLE committee_members');

        for (const member of committeeData) {
            await db.query(`
                INSERT INTO committee_members (name, role, email, phone, image)
                VALUES ($1, $2, $3, $4, $5)
            `, [member.name, member.role, member.email, member.phone, member.image]);
        }

        console.log(`✅ Seeded ${committeeData.length} committee members.`);

    } catch (err) {
        console.error('❌ Failed to seed committee members:', err);
        throw err;
    }
}

module.exports = seedCommittee;

if (require.main === module) {
    seedCommittee().then(() => process.exit(0)).catch(() => process.exit(1));
}
