
const db = require('./src/db');

async function checkSchema() {
    try {
        console.log("Checking teams table schema...");
        const result = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'teams';
        `);
        console.log("Columns:", result.rows);
    } catch (err) {
        console.error("Error:", err);
    }
}

checkSchema();
