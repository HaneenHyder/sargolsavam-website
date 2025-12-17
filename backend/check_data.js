const db = require('./src/db');
const fs = require('fs');

async function checkData() {
    const output = {};
    try {
        console.log("Checking Events...");
        const events = await db.query("SELECT id, name, status FROM events");
        output.events = events.rows;

        console.log("\nChecking Participants with Points...");
        const participants = await db.query(`
            SELECT p.id, p.points, p.position, p.status, c.name, c.category 
            FROM participants p 
            JOIN candidates c ON p.candidate_id = c.id 
            WHERE p.points > 0
        `);
        output.participants_with_points = participants.rows;

        console.log("\nChecking Published Results Query (Simulated)...");
        const query = `
            SELECT 
                c.chest_no,
                c.name,
                c.team_code,
                c.category as division,
                p.points
            FROM candidates c
            LEFT JOIN participants p ON c.id = p.candidate_id
            LEFT JOIN events e ON p.event_id = e.id
            WHERE e.status = 'Declared' AND p.points > 0
        `;
        const results = await db.query(query);
        output.published_results = results.rows;

        fs.writeFileSync('output.json', JSON.stringify(output, null, 2));
        console.log("Data written to output.json");

    } catch (err) {
        console.error("Error:", err);
        fs.writeFileSync('output.json', JSON.stringify({ error: err.message }, null, 2));
    } finally {
        process.exit();
    }
}

checkData();
