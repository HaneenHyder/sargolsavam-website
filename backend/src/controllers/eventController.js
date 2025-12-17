const db = require('../db');

exports.getAllEvents = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM events ORDER BY name ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM events WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createEvent = async (req, res) => {
    let { code, name, event_type, item_type, category } = req.body;

    // Auto-generate code if not provided
    if (!code) {
        const prefix = name.substring(0, 3).toUpperCase().replace(/\s/g, '');
        const random = Math.floor(100 + Math.random() * 900); // 3 digit random
        code = `${prefix}${random}`;
    }

    try {
        const { rows } = await db.query(
            'INSERT INTO events (code, name, event_type, item_type, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [code, name, event_type, item_type, category]
        );

        // If Group item, auto-populate participants
        if (item_type === 'Group') {
            const teams = ['100', '200', '300'];
            for (const teamCode of teams) {
                await db.query(
                    'INSERT INTO participants (event_id, team_code, status) VALUES ($1, $2, $3)',
                    [rows[0].id, teamCode, 'Pending']
                );
            }
        }

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { name, event_type, item_type, category, status } = req.body;
    try {
        const { rows } = await db.query(
            'UPDATE events SET name = $1, event_type = $2, item_type = $3, category = $4, status = $5 WHERE id = $6 RETURNING *',
            [name, event_type, item_type, category, status, id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await db.query('DELETE FROM events WHERE id = $1', [id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
