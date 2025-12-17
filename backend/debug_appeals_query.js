const { pool } = require('./src/db');

async function checkAppeals() {
    try {
        // Check if table exists
        const tableRes = await pool.query("SELECT to_regclass('public.appeals')");
        console.log('Appeals table exists:', tableRes.rows[0].to_regclass);

        if (!tableRes.rows[0].to_regclass) {
            console.log('Creating appeals table...');
            await pool.query(`
            CREATE TABLE IF NOT EXISTS appeals (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                submitted_by UUID NOT NULL,
                submitted_by_role VARCHAR(50) NOT NULL,
                event_name VARCHAR(255) NOT NULL,
                reason VARCHAR(255) NOT NULL,
                description TEXT,
                status VARCHAR(50) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        }

        // Try the query
        const query = `
            SELECT a.*,
                   CASE 
                       WHEN a.submitted_by_role = 'candidate' THEN c.name 
                       WHEN a.submitted_by_role = 'team' THEN t.name 
                   END as submitter_name,
                   CASE 
                       WHEN a.submitted_by_role = 'candidate' THEN c.chest_no 
                       WHEN a.submitted_by_role = 'team' THEN t.code 
                   END as submitter_code
            FROM appeals a
            LEFT JOIN candidates c ON a.submitted_by_role = 'candidate' AND a.submitted_by = c.id
            LEFT JOIN teams t ON a.submitted_by_role = 'team' AND a.submitted_by = t.id
            ORDER BY a.created_at DESC
        `;
        const res = await pool.query(query);
        console.log('Query successful, rows:', res.rowCount);

    } catch (err) {
        console.error('Query failed:', err.message);
    } finally {
        await pool.end();
    }
}

checkAppeals();
