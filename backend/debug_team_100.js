
const db = require('./src/db');
require('dotenv').config();

async function debugTeam() {
    try {
        console.log("Checking team '100' raw bytes...");
        const result = await db.query("SELECT code, name FROM teams WHERE code = '100'");

        if (result.rows.length === 0) {
            console.log("❌ EXACT MATCH FAILED: Code '100' not found.");

            console.log("Searching for similar codes...");
            const similar = await db.query("SELECT code, name FROM teams WHERE code LIKE '%100%'");
            similar.rows.forEach(r => {
                console.log(`Found similar: '${r.code}' (Length: ${r.code.length})`);
                console.log(`Bytes: ${Buffer.from(r.code).toString('hex')}`);
            });
        } else {
            const team = result.rows[0];
            console.log(`✅ Found Match: '${team.code}'`);
            console.log(`Name: ${team.name}`);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await db.pool.end();
    }
}

debugTeam();
