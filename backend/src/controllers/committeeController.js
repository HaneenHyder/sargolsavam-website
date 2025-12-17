const db = require('../db');

exports.getAllCommitteeMembers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM committee_members ORDER BY display_order ASC, name ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching committee members:', err);
        res.status(500).json({ error: 'Failed to fetch committee members' });
    }
};

exports.updateCommitteeMember = async (req, res) => {
    const { id } = req.params;
    const { name, role, department, email, phone, image } = req.body;

    try {
        const result = await db.query(
            `UPDATE committee_members 
             SET name = $1, role = $2, department = $3, email = $4, phone = $5, image = $6
             WHERE id = $7 RETURNING *`,
            [name, role, department, email, phone, image, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Committee member not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating committee member:', err);
        res.status(500).json({ error: 'Failed to update committee member' });
    }
};

exports.reorderCommitteeMembers = async (req, res) => {
    const { items } = req.body; // Expects array of { id, display_order }

    if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        await db.query('BEGIN');
        for (const item of items) {
            await db.query(
                'UPDATE committee_members SET display_order = $1 WHERE id = $2',
                [item.display_order, item.id]
            );
        }
        await db.query('COMMIT');
        res.status(200).json({ message: 'Order updated successfully' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error('Error reordering committee members:', err);
        res.status(500).json({ error: 'Failed to reorder committee members' });
    }
};
