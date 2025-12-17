const { pool } = require('./src/db');

async function checkColumns() {
    try {
        const res = await pool.query(`
      SELECT column_name, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'participants';
    `);
        console.log(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkColumns();
