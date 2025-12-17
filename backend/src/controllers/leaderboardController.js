const db = require('../db');

exports.getDetailedLeaderboard = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.chest_no,
                c.name,
                c.team_code,
                c.category as division,
                COUNT(p.event_id) as events_participated,
                COALESCE(SUM(CASE WHEN p.position = 1 THEN 1 ELSE 0 END), 0) as first_prizes,
                COALESCE(SUM(CASE WHEN p.position = 2 THEN 1 ELSE 0 END), 0) as second_prizes,
                COALESCE(SUM(CASE WHEN p.position = 3 THEN 1 ELSE 0 END), 0) as third_prizes,
                COALESCE(SUM(p.points), 0) as total_points,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'event_name', e.name,
                        'position', p.position,
                        'grade', p.grade,
                        'points', p.points
                    )
                ) as event_results
            FROM candidates c
            LEFT JOIN participants p ON c.id = p.candidate_id
            LEFT JOIN events e ON p.event_id = e.id
            WHERE e.status = 'Declared' AND p.points > 0
            GROUP BY c.id, c.chest_no, c.name, c.team_code, c.category
            ORDER BY total_points DESC
        `;

        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
