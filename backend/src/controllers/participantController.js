const db = require('../db');
const { calculatePoints } = require('../utils/scoring');

exports.getParticipantsByEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        // First check if it's a Group event and if participants exist
        const eventRes = await db.query('SELECT item_type FROM events WHERE id = $1', [eventId]);
        if (eventRes.rows.length > 0 && eventRes.rows[0].item_type === 'Group') {
            const countRes = await db.query('SELECT COUNT(*) FROM participants WHERE event_id = $1', [eventId]);
            if (parseInt(countRes.rows[0].count) === 0) {
                // Auto-populate teams
                const teams = ['100', '200', '300'];
                for (const teamCode of teams) {
                    await db.query(
                        'INSERT INTO participants (event_id, team_code, status) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                        [eventId, teamCode, 'Pending']
                    );
                }
            }
        }

        const { rows } = await db.query(`
      SELECT p.*, c.name as candidate_name, c.chest_no, t.name as team_name 
      FROM participants p
      LEFT JOIN candidates c ON p.candidate_id = c.id
      LEFT JOIN teams t ON p.team_code = t.code
      WHERE p.event_id = $1
      ORDER BY p.position ASC NULLS LAST, p.id ASC
    `, [eventId]);

        const sanitizedRows = rows.map(row => {
            const { points, ...rest } = row;
            return rest;
        });

        res.json(sanitizedRows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addParticipant = async (req, res) => {
    const { eventId } = req.params;
    let { candidates, chest_numbers } = req.body;

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        // Resolve chest_numbers to candidates if provided
        if (chest_numbers && Array.isArray(chest_numbers) && chest_numbers.length > 0) {
            console.log(`[BulkAdd] Resolving ${chest_numbers.length} chest numbers`);

            // Find candidates by chest_no
            const { rows: foundCandidates } = await client.query(
                'SELECT id, chest_no, team_code FROM candidates WHERE chest_no = ANY($1)',
                [chest_numbers]
            );

            const foundChestNos = foundCandidates.map(c => c.chest_no);
            const missingChestNos = chest_numbers.filter(cn => !foundChestNos.includes(cn));

            if (!candidates) candidates = [];

            foundCandidates.forEach(cand => {
                if (!candidates.some(c => c.candidate_id === cand.id)) {
                    candidates.push({
                        candidate_id: cand.id,
                        team_code: cand.team_code
                    });
                }
            });

            if (missingChestNos.length > 0) {
                res.locals.missingChestNos = missingChestNos;
            }
        }

        if (!candidates || !Array.isArray(candidates)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Invalid input, expected array of candidates' });
        }

        if (candidates.length === 0) {
            await client.query('ROLLBACK');
            if (res.locals && res.locals.missingChestNos) {
                return res.json({ added: [], notFound: res.locals.missingChestNos });
            }
            return res.status(200).json([]);
        }

        console.log(`[BulkAdd] Processing ${candidates.length} candidates for event ${eventId}`);

        // Construct bulk insert values
        const values = [eventId];

        candidates.forEach(cand => {
            values.push(cand.candidate_id, cand.team_code);
        });

        const placeholders = candidates.map((_, i) =>
            `($1, $${i * 2 + 2}, $${i * 2 + 3}, 'Pending')`
        ).join(',');

        const query = `
            INSERT INTO participants (event_id, candidate_id, team_code, status)
            VALUES ${placeholders}
            ON CONFLICT DO NOTHING
            RETURNING *
        `;

        console.log(`[BulkAdd] Query: ${query}`);

        const { rows } = await client.query(query, values);

        await client.query('COMMIT');

        if (chest_numbers) {
            res.status(201).json({
                added: rows,
                notFound: res.locals.missingChestNos || [],
                totalRequested: chest_numbers.length
            });
        } else {
            res.status(201).json(rows);
        }
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error adding participants:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

exports.removeParticipant = async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to remove participant with ID: ${id}`);

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        // Get participant details first to check for points
        const { rows: partRows } = await client.query('SELECT * FROM participants WHERE id = $1', [id]);

        if (partRows.length === 0) {
            await client.query('ROLLBACK');
            console.log(`Participant with ID ${id} not found.`);
            return res.status(404).json({ error: 'Participant not found' });
        }

        const participant = partRows[0];

        // Delete the participant
        await client.query('DELETE FROM participants WHERE id = $1', [id]);

        // If participant had points, update team total
        if (participant.points > 0 && participant.team_code) {
            await client.query(`
                UPDATE teams 
                SET total_points = total_points - $1 
                WHERE code = $2
            `, [participant.points, participant.team_code]);
        }

        await client.query('COMMIT');
        console.log(`Participant with ID ${id} removed successfully.`);
        res.json({ message: 'Participant removed' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Error removing participant ${id}:`, err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

exports.publishResults = async (req, res) => {
    const { eventId } = req.params;
    const { results } = req.body; // Array of { participant_id, position, grade, status }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Get event details for scoring
        const eventRes = await client.query('SELECT * FROM events WHERE id = $1', [eventId]);
        if (eventRes.rows.length === 0) throw new Error('Event not found');
        const event = eventRes.rows[0];

        // Reset points for this event first? Or assume overwrite?
        // Better to reset points for all participants in this event to 0 before applying new results
        // to avoid double counting if republished.
        await client.query('UPDATE participants SET points = 0, position = NULL, grade = NULL, status = \'Pending\' WHERE event_id = $1', [eventId]);

        for (const result of results) {
            const { participant_id, position, grade, status } = result;
            let points = 0;

            if (status === 'Winner' && position) {
                points = calculatePoints(event.item_type, position, grade);
            }

            await client.query(
                'UPDATE participants SET position = $1, grade = $2, status = $3, points = $4 WHERE id = $5',
                [position, grade, status, points, participant_id]
            );
        }

        // Update Event Status
        await client.query('UPDATE events SET status = \'Declared\' WHERE id = $1', [eventId]);

        // Recalculate Team Totals
        // We need to recalc for ALL teams involved in this event? Or just global recalc?
        // Global recalc is safer but slower. 
        // Let's do global recalc for the teams involved.
        // Or just update all teams. There are only 3 teams.

        await client.query(`
        UPDATE teams t
        SET total_points = (
            SELECT COALESCE(SUM(p.points), 0)
            FROM participants p
            WHERE p.team_code = t.code
        )
    `);

        await client.query('COMMIT');
        res.json({ message: 'Results published and points updated' });

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};
