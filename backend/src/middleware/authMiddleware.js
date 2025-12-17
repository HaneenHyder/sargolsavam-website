const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const logDebug = (msg) => {
    const logPath = path.join(__dirname, '../../debug_team_browser.log');
    fs.appendFileSync(logPath, `${new Date().toISOString()} - [AuthMiddleware] ${msg}\n`);
};




exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    console.log('[DEBUG] verifyToken called');
    console.log('[DEBUG] Cookies:', req.cookies); // Debug cookies
    console.log('[DEBUG] Auth Header:', req.headers['authorization']); // Debug header
    console.log('[DEBUG] Origin:', req.headers['origin']);

    if (!token) {
        logDebug(`No token provided. headers: ${JSON.stringify(req.headers)}`);
        console.log('verifyToken: No token provided');
        return res.status(403).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logDebug(`Token decoded: ${decoded.role} id: ${decoded.code}`);
        req.user = decoded;
        next();
    } catch (err) {
        logDebug(`Invalid token: ${err.message}`);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.log('isAdmin: Access denied. User role:', req.user?.role);
        res.status(403).json({ error: 'Require Admin Role' });
    }
};
