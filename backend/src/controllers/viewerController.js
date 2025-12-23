const db = require('../db');
const UAParser = require('ua-parser-js');

// Track page view
exports.trackView = async (req, res) => {
    try {
        const { pageUrl, referrer, sessionId } = req.body;
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        // Parse user agent to extract device, browser, OS info
        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        const deviceType = result.device.type || 'desktop';
        const browser = `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim();
        const os = `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim();

        // Insert page view record
        await db.query(
            `INSERT INTO page_views (page_url, ip_address, user_agent, device_type, browser, os, referrer, session_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [pageUrl, ipAddress, userAgent, deviceType, browser, os, referrer, sessionId]
        );

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error tracking view:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get viewer statistics
exports.getStats = async (req, res) => {
    try {
        // Total page views
        const totalViewsResult = await db.query('SELECT COUNT(*) FROM page_views');
        const totalViews = parseInt(totalViewsResult.rows[0].count);

        // Unique visitors (by IP)
        const uniqueVisitorsResult = await db.query('SELECT COUNT(DISTINCT ip_address) FROM page_views');
        const uniqueVisitors = parseInt(uniqueVisitorsResult.rows[0].count);

        // Unique sessions
        const uniqueSessionsResult = await db.query('SELECT COUNT(DISTINCT session_id) FROM page_views');
        const uniqueSessions = parseInt(uniqueSessionsResult.rows[0].count);

        // Views by device type
        const deviceStatsResult = await db.query(`
            SELECT device_type, COUNT(*) as count
            FROM page_views
            GROUP BY device_type
            ORDER BY count DESC
        `);

        // Views by browser
        const browserStatsResult = await db.query(`
            SELECT browser, COUNT(*) as count
            FROM page_views
            GROUP BY browser
            ORDER BY count DESC
            LIMIT 10
        `);

        // Views by OS
        const osStatsResult = await db.query(`
            SELECT os, COUNT(*) as count
            FROM page_views
            GROUP BY os
            ORDER BY count DESC
            LIMIT 10
        `);

        // Popular pages
        const popularPagesResult = await db.query(`
            SELECT page_url, COUNT(*) as views
            FROM page_views
            GROUP BY page_url
            ORDER BY views DESC
            LIMIT 10
        `);

        // Recent views (last 24 hours)
        const recentViewsResult = await db.query(`
            SELECT COUNT(*) FROM page_views
            WHERE created_at >= NOW() - INTERVAL '24 hours'
        `);
        const recentViews = parseInt(recentViewsResult.rows[0].count);

        res.json({
            totalViews,
            uniqueVisitors,
            uniqueSessions,
            recentViews,
            deviceStats: deviceStatsResult.rows,
            browserStats: browserStatsResult.rows,
            osStats: osStatsResult.rows,
            popularPages: popularPagesResult.rows
        });
    } catch (err) {
        console.error('Error fetching viewer stats:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get login logs
exports.getLoginLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const result = await db.query(`
            SELECT 
                id,
                admin_id,
                username,
                ip_address,
                user_agent,
                success,
                failure_reason,
                created_at
            FROM login_logs
            ORDER BY created_at DESC
            LIMIT $1
        `, [limit]);

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching login logs:', err);
        res.status(500).json({ error: err.message });
    }
};
