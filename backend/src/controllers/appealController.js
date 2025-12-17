const db = require('../db');

exports.createAppeal = async (req, res) => {
    const { event_name, reason, description, payment_order_id, payment_id, payment_signature } = req.body;
    const { id, role, chest_no, code } = req.user;

    // Determine submitted_by ID and Role
    let submittedBy = id;
    console.log('createAppeal: User:', req.user);
    console.log('createAppeal: Body:', req.body);

    try {
        if (role === 'team') {
            // Use team code directly
            submittedBy = code;
        }

        console.log('createAppeal: Submitting as:', submittedBy);

        const result = await db.query(
            `INSERT INTO appeals (submitted_by, submitted_by_role, event_name, reason, description, payment_order_id, payment_id, payment_status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid') RETURNING *`,
            [submittedBy, role, event_name, reason, description, payment_order_id, payment_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating appeal:', err);
        res.status(500).json({ error: 'Failed to submit appeal', details: err.message });
    }
};

exports.getMyAppeals = async (req, res) => {
    const { id, role, code } = req.user;
    let submittedBy = id;

    try {
        if (role === 'team') {
            submittedBy = code;
        }

        const result = await db.query(
            'SELECT * FROM appeals WHERE submitted_by = $1 ORDER BY created_at DESC',
            [submittedBy]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching appeals:', err);
        res.status(500).json({ error: 'Failed to fetch appeals' });
    }
};

exports.getAllAppeals = async (req, res) => {
    try {
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
            LEFT JOIN candidates c ON a.submitted_by_role = 'candidate' AND a.submitted_by = c.id::text
            LEFT JOIN teams t ON a.submitted_by_role = 'team' AND a.submitted_by = t.code
            ORDER BY a.created_at DESC
        `;
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching all appeals:', err);
        res.status(500).json({ error: 'Failed to fetch all appeals' });
    }
}


exports.updateAppealStatus = async (req, res) => {
    const { id } = req.params;
    const { status, refund_status } = req.body;

    if (!['Pending', 'Resolved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        let query = 'UPDATE appeals SET status = $1, updated_at = NOW()';
        let params = [status];
        let paramIndex = 2;

        if (refund_status) {
            query += `, refund_status = $${paramIndex}`;
            params.push(refund_status);
            paramIndex++;
        }

        query += ` WHERE id = $${paramIndex} RETURNING *`;
        params.push(id);

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Appeal not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating appeal status:', err);
        res.status(500).json({ error: 'Failed to update appeal status' });
    }
};
