const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

const fs = require('fs');
const path = require('path');

exports.login = async (req, res) => {
    try {
        const logPath = path.join(__dirname, '../../debug_login.log');
        fs.appendFileSync(logPath, `${new Date().toISOString()} - Body: ${JSON.stringify(req.body)}\n`);

        console.log('Login Request Body:', req.body);
        const { username, password, type, code } = req.body || {}; // Handle undefined body safely
        if (type === 'admin') {
            const { rows } = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
            if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

            const admin = rows[0];
            const validPassword = await bcrypt.compare(password, admin.password_hash);
            if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

            // Set HTTP-only cookie
            console.log(`[DEBUG] Setting cookie. NODE_ENV=${process.env.NODE_ENV}, Secure=${process.env.NODE_ENV === 'production'}`);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Lax for dev
                path: '/',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            return res.json({ message: 'Login successful', role: admin.role, token });
        }

        if (type === 'team') {
            const { rows } = await db.query('SELECT * FROM teams WHERE code = $1', [code]);
            if (rows.length === 0) return res.status(401).json({ error: 'Invalid team code' });

            const team = rows[0];
            // If password is provided, verify it. If not (legacy), maybe allow? No, let's enforce password.
            if (!password) return res.status(400).json({ error: 'Password required' });

            const validPassword = await bcrypt.compare(password.trim(), team.password_hash);
            if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

            const token = jwt.sign({ code: team.code, role: 'team' }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: 86400000
            });
            return res.json({ message: 'Login successful', role: 'team', code: team.code, name: team.name, token });
        }

        if (type === 'candidate') {
            // code is chest_no
            const { rows } = await db.query('SELECT * FROM candidates WHERE chest_no = $1', [code]);
            if (rows.length === 0) return res.status(401).json({ error: 'Invalid chest number' });

            // Verify Name (Case insensitive check)
            const candidate = rows[0];
            if (candidate.name.trim().toLowerCase() !== username.trim().toLowerCase()) {
                return res.status(401).json({ error: 'Invalid name for this chest number' });
            }

            const token = jwt.sign({ id: candidate.id, chest_no: candidate.chest_no, role: 'candidate' }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: 86400000
            });
            return res.json({ message: 'Login successful', role: 'candidate', chest_no: candidate.chest_no, id: candidate.id, team_code: candidate.team_code, token });
        }

        return res.status(400).json({ error: 'Invalid login type' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};
