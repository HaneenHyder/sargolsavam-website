
const db = require('./src/db');
require('dotenv').config();

async function checkSchema() {
    try {
        const result = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'teams' AND column_name = 'code'
        `);
        console.log("Teams 'code' column type:", result.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await db.pool.end();
    }
}

checkSchema();
