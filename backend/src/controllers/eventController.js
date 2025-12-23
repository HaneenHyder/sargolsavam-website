const db = require('../db');
const bcrypt = require('bcryptjs');

exports.getAllEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', category, item_type, event_type, all } = req.query;

        let query = 'SELECT * FROM events';
        let countQuery = 'SELECT COUNT(*) FROM events';
        let params = [];
        let conditions = [];

        if (search) {
            conditions.push(`(name ILIKE $${params.length + 1} OR code ILIKE $${params.length + 1})`);
            params.push(`%${search}%`);
        }
        if (category && category !== 'All') {
            conditions.push(`category = $${params.length + 1}`);
            params.push(category);
        }
        if (item_type && item_type !== 'All') {
            conditions.push(`item_type = $${params.length + 1}`);
            params.push(item_type);
        }
        if (event_type && event_type !== 'All') {
            conditions.push(`event_type = $${params.length + 1}`);
            params.push(event_type);
        }

        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        query += ' ORDER BY name ASC';

        let queryParams = [...params];
        const countParams = [...params];

        if (all !== 'true') {
            const totalLimit = parseInt(limit);
            const totalOffset = (parseInt(page) - 1) * totalLimit;
            query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
            queryParams.push(totalLimit, totalOffset);
        }

        const [eventsRes, countRes] = await Promise.all([
            db.query(query, queryParams),
            db.query(countQuery, countParams)
        ]);

        const total = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(total / limit);

        res.json({
            data: eventsRes.rows,
            pagination: {
                total,
                page: parseInt(page),
                totalPages,
                limit: parseInt(limit)
            }
        });
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
        code = `${prefix}${random} `;
    }

    try {
        const { rows } = await db.query(
            'INSERT INTO events (code, name, event_type, item_type, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [code, name, event_type, item_type, category]
        );

        // If Group item, auto-populate participants
        if (item_type === 'Group') {
            const teams = ['100', '200', '300'];
            const values = [rows[0].id];
            const placeholders = teams.map((team, index) => `($1, $${index + 2}, 'Pending')`).join(',');

            teams.forEach(team => values.push(team));

            await db.query(
                `INSERT INTO participants(event_id, team_code, status) VALUES ${placeholders} `,
                values
            );
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
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        // Delete participants first due to FK constraint
        await client.query('DELETE FROM participants WHERE event_id = $1', [id]);

        const { rowCount } = await client.query('DELETE FROM events WHERE id = $1', [id]);

        if (rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Event not found' });
        }

        await client.query('COMMIT');
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

exports.deleteAllEvents = async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        // Verify admin password
        const adminId = req.user.id;
        const { rows: adminRows } = await client.query('SELECT password_hash FROM admins WHERE id = $1', [adminId]);

        if (adminRows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Admin not found' });
        }

        const validPassword = await bcrypt.compare(password, adminRows[0].password_hash);
        if (!validPassword) {
            await client.query('ROLLBACK');
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Delete participants first due to FK constraint
        const participantsRes = await client.query('DELETE FROM participants');

        // Delete events
        const eventsRes = await client.query('DELETE FROM events');

        await client.query('COMMIT');

        res.json({
            message: 'All events deleted successfully',
            deletedEvents: eventsRes.rowCount,
            deletedParticipants: participantsRes.rowCount
        });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};
