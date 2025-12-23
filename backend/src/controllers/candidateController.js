const db = require('../db');

const getDashboardData = async (req, res) => {
    try {
        const candidateId = req.user.id;

        // 1. Fetch Candidate Details
        const candidateResult = await db.query(
            'SELECT * FROM candidates WHERE id = $1',
            [candidateId]
        );

        if (candidateResult.rows.length === 0) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const candidate = candidateResult.rows[0];

        // 2. Fetch Event Participations (All events the candidate is part of)
        const participationsResult = await db.query(
            `SELECT p.event_id, e.name as event_name, e.event_type, e.status as event_status
             FROM participants p
             JOIN events e ON p.event_id = e.id
             WHERE p.candidate_id = $1`,
            [candidateId]
        );

        // 3. Fetch Results (Only from Declared events where candidate has a position/grade)
        // We can actually derive this from participations, but let's be explicit about "Results"
        // A result is when an event is 'Declared' and the participant has a position/grade.

        const results = participationsResult.rows.map(p => {
            // If event is not declared, show as pending/scheduled
            if (p.event_status !== 'Declared') {
                return {
                    event_id: p.event_id,
                    event_name: p.event_name,
                    event_type: p.event_type,
                    position: null,
                    grade: null,
                    points: 0,
                    status: 'Pending' // Or 'Scheduled'
                };
            }

            // If declared, we need to fetch the actual result details (position, grade)
            // Wait, I didn't select position/grade in participationsResult. Let's update the query.
            return null;
        }).filter(Boolean); // We'll refactor this below

        // Refactored Query: Get everything in one go
        const combinedQuery = await db.query(
            `SELECT p.id, p.event_id, p.position, p.grade, p.points, p.status as participant_status,
                    e.name as event_name, e.event_type, e.status as event_status
             FROM participants p
             JOIN events e ON p.event_id = e.id
             WHERE p.candidate_id = $1`,
            [candidateId]
        );

        const combinedResults = combinedQuery.rows.map(row => {
            const isPublished = row.event_status === 'Declared';

            return {
                id: row.id,
                event_id: row.event_id,
                event_name: row.event_name,
                event_type: row.event_type,
                // Only show result details if published
                position: isPublished ? row.position : null,
                grade: isPublished ? row.grade : null,
                points: isPublished ? row.points : 0,
                status: isPublished ? (row.participant_status === 'Absent' ? 'Absent' : 'published') : 'pending'
            };
        });

        // Calculate medal counts (only from published results)
        const medalCounts = { first: 0, second: 0, third: 0 };
        combinedResults.forEach(r => {
            if (r.status === 'published') {
                if (r.position === 1) medalCounts.first++;
                else if (r.position === 2) medalCounts.second++;
                else if (r.position === 3) medalCounts.third++;
            }
        });

        res.json({
            candidate,
            results: combinedResults,
            medalCounts
        });

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error fetching dashboard data:`, error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getCandidateByChestNo = async (req, res) => {
    try {
        const { chest_no } = req.params;

        // 1. Fetch Candidate Details
        const candidateResult = await db.query(
            'SELECT * FROM candidates WHERE chest_no = $1',
            [chest_no]
        );

        if (candidateResult.rows.length === 0) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const candidate = candidateResult.rows[0];

        // 2. Fetch Event Participations
        const participationsResult = await db.query(
            `SELECT ep.event_id, e.name as event_name, e.event_type, e.category as item_type
             FROM participants ep
             JOIN events e ON ep.event_id = e.id
             WHERE ep.candidate_id = $1`,
            [candidate.id]
        );

        // 3. Fetch Results
        const resultsResult = await db.query(
            `SELECT r.event_id, r.position, r.grade, r.status
             FROM results r
             WHERE r.candidate_id = $1 AND r.status = 'published'`,
            [candidate.id]
        );

        // Combine
        const resultsMap = new Map();
        resultsResult.rows.forEach(r => resultsMap.set(r.event_id, r));

        const participations = participationsResult.rows.map(p => {
            const result = resultsMap.get(p.event_id);
            return {
                event_name: p.event_name,
                event_type: p.event_type,
                item_type: p.item_type, // Assuming category is item_type
                status: result ? (result.position ? 'Winner' : 'Participated') : 'Registered',
                position: result ? result.position : null,
                grade: result ? result.grade : null
            };
        });

        res.json({
            name: candidate.name,
            chest_no: candidate.chest_no,
            team_code: candidate.team_code,
            category: candidate.category,
            role: 'Candidate', // Hardcoded or derived
            participations
        });

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error fetching candidate by chest no:`, error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllCandidates = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', all } = req.query;

        let query = 'SELECT * FROM candidates';
        let countQuery = 'SELECT COUNT(*) FROM candidates';
        let params = [];

        if (search) {
            query += ' WHERE name ILIKE $1 OR chest_no ILIKE $1 OR team_code ILIKE $1';
            countQuery += ' WHERE name ILIKE $1 OR chest_no ILIKE $1 OR team_code ILIKE $1';
            params.push(`%${search}%`);
        }

        query += ` ORDER BY CAST(chest_no AS INTEGER) ASC`;

        // Only apply pagination if all=true is not set
        let queryParams = [...params];
        if (all !== 'true') {
            const offset = (page - 1) * limit;
            query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            queryParams.push(limit, offset);
        }

        const [candidatesRes, countRes] = await Promise.all([
            db.query(query, queryParams),
            db.query(countQuery, params)
        ]);

        const total = parseInt(countRes.rows[0].count);
        const totalPages = all === 'true' ? 1 : Math.ceil(total / limit);

        res.json({
            data: candidatesRes.rows,
            pagination: {
                total,
                page: all === 'true' ? 1 : parseInt(page),
                totalPages,
                limit: all === 'true' ? total : parseInt(limit)
            }
        });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error fetching all candidates:`, error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDashboardData,
    getCandidateByChestNo,
    getAllCandidates
};
