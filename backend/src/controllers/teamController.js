const db = require('../db');
const fs = require('fs');
const path = require('path');

const logDebug = (msg) => {
    try {
        const logPath = path.join(__dirname, '../../debug_team_browser.log');
        fs.appendFileSync(logPath, `${new Date().toISOString()} - [TeamController] ${msg}\n`);
    } catch (e) {
        console.error("Logging failed", e);
    }
};

exports.getAllTeams = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM teams ORDER BY code');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTeamByCode = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM teams WHERE code = $1', [req.params.code]);
        if (rows.length === 0) return res.status(404).json({ error: 'Team not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDashboardData = async (req, res) => {
    try {
        const teamCode = String(req.user.code).trim();
        logDebug(`Dashboard requested for team: '${teamCode}' (Type: ${typeof teamCode}) Hex: ${Buffer.from(teamCode).toString('hex')}`);

        // 1. Fetch Team Details
        const teamResult = await db.query('SELECT * FROM teams WHERE code = $1', [teamCode]);

        if (teamResult.rows.length === 0) {
            logDebug(`❌ Team '${teamCode}' NOT FOUND in DB. Query failed.`);
            return res.status(404).json({ message: `Team '${teamCode}' not found` });
        }
        const team = teamResult.rows[0];

        // 2. Fetch Team Candidates
        const candidatesResult = await db.query(
            'SELECT * FROM candidates WHERE team_code = $1 ORDER BY chest_no',
            [teamCode]
        );
        console.log(`[Backend] Found ${candidatesResult.rows.length} candidates for team ${teamCode}`);

        // 3. Fetch Team Results (Published only)
        // Join with events and candidates to get names
        const resultsResult = await db.query(`
            SELECT r.id, r.event_id, r.candidate_id, r.position, r.grade, r.points, r.status,
                   e.name as event_name, e.event_type, e.item_type,
                   c.chest_no, c.name as candidate_name
            FROM participants r
            JOIN events e ON r.event_id = e.id
            LEFT JOIN candidates c ON r.candidate_id = c.id
            WHERE r.team_code = $1 AND (r.status = 'Winner' OR r.status = 'Absent') AND e.status = 'Declared'
            ORDER BY e.name
        `, [teamCode]);

        // 4. Fetch Participation Analytics (Category Breakdown)
        // Count participations per category
        const analyticsResult = await db.query(`
            SELECT e.category, COUNT(*) as count 
            FROM participants p
            JOIN events e ON p.event_id = e.id
            WHERE p.team_code = $1 AND p.candidate_id IS NOT NULL
            GROUP BY e.category
        `, [teamCode]);

        const participationStats = analyticsResult.rows;

        // 5. Fetch Candidates with Zero Participation
        // Find candidates who have NO entries in participants table for this team
        const zeroParticipationResult = await db.query(`
            SELECT * FROM candidates 
            WHERE team_code = $1 
            AND id NOT IN (
                SELECT DISTINCT candidate_id 
                FROM participants 
                WHERE team_code = $1 
                AND candidate_id IS NOT NULL
            )
            ORDER BY name
        `, [teamCode]);

        const zeroParticipationCandidates = zeroParticipationResult.rows;


        // Calculate medal counts and total points
        const medalCounts = { first: 0, second: 0, third: 0 };
        let totalPoints = 0;

        resultsResult.rows.forEach(r => {
            if (r.position === 1) medalCounts.first++;
            else if (r.position === 2) medalCounts.second++;
            else if (r.position === 3) medalCounts.third++;

            totalPoints += (r.points || 0);
        });

        res.json({
            team: { ...team, total_points: totalPoints }, // Override with calculated points
            candidates: candidatesResult.rows,
            results: resultsResult.rows,
            participationStats,
            zeroParticipationCandidates,
            medalCounts
        });

    } catch (err) {
        console.error(err);
        logDebug(`Error: ${err.message}`);
        res.status(500).json({ error: 'Server error' });
    }
};
