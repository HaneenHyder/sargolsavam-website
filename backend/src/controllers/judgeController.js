const db = require('../db');

exports.getAllJudges = async (req, res) => {
    try {
        const { rows: judges } = await db.query('SELECT * FROM judges ORDER BY name ASC');

        // Fetch assignments for each judge
        const { rows: assignments } = await db.query(`
            SELECT ja.*, ja.judge_id 
            FROM judge_assignments ja
        `);

        // Map assignments to judges
        const judgesWithSchedule = judges.map(judge => {
            const judgeAssignments = assignments.filter(a => a.judge_id === judge.id);
            return {
                ...judge,
                schedule: judgeAssignments
            };
        });

        res.json(judgesWithSchedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getJudgeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM judges WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Judge not found' });

        const judge = rows[0];
        const { rows: assignments } = await db.query('SELECT * FROM judge_assignments WHERE judge_id = $1', [id]);

        res.json({ ...judge, schedule: assignments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
