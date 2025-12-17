
const db = require('./src/db');
require('dotenv').config();

async function checkLength() {
    try {
        const result = await db.query("SELECT code, length(code) as len, octet_length(code) as bytes FROM teams WHERE code LIKE '%100%'");
        console.log("DB Matches for '100':");
        console.table(result.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await db.pool.end();
    }
}

checkLength();
