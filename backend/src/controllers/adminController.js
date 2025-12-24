const db = require('../db');
const xlsx = require('xlsx');
const fs = require('fs');
const bcrypt = require('bcryptjs');

exports.getDashboardStats = async (req, res) => {
    try {
        const eventsQuery = db.query('SELECT COUNT(*) FROM events');
        const candidatesQuery = db.query('SELECT COUNT(*) FROM candidates');
        const resultsQuery = db.query("SELECT COUNT(*) FROM events WHERE status = 'Declared'");

        const [eventsRes, candidatesRes, resultsRes] = await Promise.all([eventsQuery, candidatesQuery, resultsQuery]);

        res.json({
            totalEvents: parseInt(eventsRes.rows[0].count),
            totalCandidates: parseInt(candidatesRes.rows[0].count),
            publishedResults: parseInt(resultsRes.rows[0].count)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLoginStats = async (req, res) => {
    try {
        const query = `
            SELECT login_type, success, COUNT(*) as count 
            FROM login_logs 
            GROUP BY login_type, success
        `;
        const { rows } = await db.query(query);

        const stats = {
            admin: { success: 0, fail: 0 },
            team: { success: 0, fail: 0 },
            candidate: { success: 0, fail: 0 }
        };

        rows.forEach(row => {
            const type = row.login_type || 'unknown';
            const status = row.success ? 'success' : 'fail';
            const count = parseInt(row.count);

            if (stats[type]) {
                stats[type][status] = count;
            }
        });

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM teams ORDER BY total_points DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.exportTeam = async (req, res) => {
    const { code } = req.params;
    try {
        const { rows } = await db.query('SELECT * FROM candidates WHERE team_code = $1', [code]);
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(rows);
        xlsx.utils.book_append_sheet(wb, ws, "Candidates");
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', `attachment; filename="team_${code}.xlsx"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.importCandidates = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        let added = 0;
        let updated = 0;
        let errors = [];

        for (const row of data) {
            const getValue = (keyPart) => {
                const key = Object.keys(row).find(k => k.toLowerCase().includes(keyPart.toLowerCase()));
                return key ? String(row[key]).trim() : null;
            };

            const category = getValue('category');
            const team_code = getValue('Team Code');
            const chest_no = getValue('Chess Number') || getValue('Chest No');
            const name = getValue('Name');
            const role = getValue('Role');

            if (!chest_no || !name || !team_code) {
                errors.push({ row, error: 'Missing required fields' });
                continue;
            }

            try {
                await db.query(
                    `INSERT INTO candidates (chest_no, name, team_code, category, role)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (chest_no) 
                 DO UPDATE SET name = EXCLUDED.name, team_code = EXCLUDED.team_code, category = EXCLUDED.category, role = EXCLUDED.role`,
                    [chest_no, name, team_code, category, role]
                );
                added++;
            } catch (err) {
                errors.push({ chest_no, error: err.message });
            }
        }

        fs.unlinkSync(req.file.path);
        res.json({ message: 'Import processed', added, updated, errors });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const { rows } = await db.query(
            'INSERT INTO admins (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [username, hash, 'admin']
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
