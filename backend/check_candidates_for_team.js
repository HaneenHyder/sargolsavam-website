
const db = require('./src/db');
require('dotenv').config();

async function checkCandidates() {
    try {
        console.log("Checking candidates for team '100'...");
        const result = await db.query("SELECT * FROM candidates WHERE team_code = '100'");
        console.log(`Found ${result.rows.length} candidates.`);
        if (result.rows.length > 0) {
            console.log("First candidate:", result.rows[0]);
        } else {
            console.log("Checking all candidates to see sample data...");
            const sample = await db.query("SELECT * FROM candidates LIMIT 5");
            console.log("Sample candidates:", sample.rows);
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await db.pool.end();
    }
}

checkCandidates();
