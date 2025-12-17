const db = require('../db');

const POINTS_MAP = {
    Individual: {
        '1st': { A: 10, B: 8, C: 6, D: 5 },
        '2nd': { A: 8, B: 6, C: 4, D: 3 },
        '3rd': { A: 6, B: 4, C: 2, D: 1 }
    },
    Group: {
        '1st': { A: 20, B: 15, C: 13, D: 10 },
        '2nd': { A: 15, B: 10, C: 8, D: 5 },
        '3rd': { A: 13, B: 8, C: 6, D: 3 }
    }
};

const calculatePoints = (itemType, position, grade) => {
    if (position === 'Absent') return 0;
    return POINTS_MAP[itemType]?.[position]?.[grade] || 0;
};

exports.getResults = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT p.*, e.name as event_name, e.item_type, e.event_type, e.category, e.status as event_status, c.name as candidate_name, c.chest_no, t.name as team_name
            FROM participants p
            JOIN events e ON p.event_id = e.id
            LEFT JOIN candidates c ON p.candidate_id = c.id
            LEFT JOIN teams t ON p.team_code = t.code
            WHERE p.position IS NOT NULL OR p.grade IS NOT NULL
            ORDER BY e.name, p.position
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addResults = async (req, res) => {
    const { results } = req.body; // Array of { event_id, candidate_id, team_code, position, grade }

    if (!Array.isArray(results) || results.length === 0) {
        return res.status(400).json({ error: 'No results provided' });
    }

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        for (const result of results) {
            const { event_id, candidate_id, team_code, position, grade } = result;

            // Get event to check item_type for point calculation
            const { rows: eventRows } = await client.query('SELECT item_type FROM events WHERE id = $1', [event_id]);
            if (eventRows.length === 0) continue;

            const itemType = eventRows[0].item_type;
            const points = calculatePoints(itemType, position, grade);

            // Update participant
            // If candidate_id is provided, use it. If not, use team_code (for group events without specific candidates)
            let query = '';
            let params = [];

            if (candidate_id) {
                query = `
                    UPDATE participants 
                    SET position = $1, grade = $2, points = $3, status = $4
                    WHERE event_id = $5 AND candidate_id = $6
                `;
                const status = position === 'Absent' ? 'Absent' : 'Winner';
                params = [position === 'Absent' ? null : parseInt(position), position === 'Absent' ? null : grade, points, status, event_id, candidate_id];
            } else if (team_code) {
                query = `
                    UPDATE participants 
                    SET position = $1, grade = $2, points = $3, status = $4
                    WHERE event_id = $5 AND team_code = $6
                `;
                const status = position === 'Absent' ? 'Absent' : 'Winner';
                params = [position === 'Absent' ? null : parseInt(position), position === 'Absent' ? null : grade, points, status, event_id, team_code];
            }

            if (query) {
                await client.query(query, params);
            }
        }

        await client.query('COMMIT');
        res.json({ message: 'Results added successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

exports.publishResults = async (req, res) => {
    const { event_id } = req.body;
    try {
        await db.query('UPDATE events SET status = $1 WHERE id = $2', ['Declared', event_id]);
        res.json({ message: 'Results published successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteResult = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`
            UPDATE participants 
            SET position = NULL, grade = NULL, points = 0, status = 'Pending'
            WHERE id = $1
        `, [id]);
        res.json({ message: 'Result deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
