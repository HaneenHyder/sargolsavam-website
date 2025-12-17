const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const trackView = async (req, res) => {
    const { pageUrl } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    try {
        await pool.query(
            'INSERT INTO analytics (page_url, ip_address, user_agent) VALUES ($1, $2, $3)',
            [pageUrl, ipAddress, userAgent]
        );
        res.status(200).json({ message: 'View tracked' });
    } catch (error) {
        console.error('Error tracking view:', error);
        res.status(500).json({ error: 'Failed to track view' });
    }
};

const getStats = async (req, res) => {
    try {
        // Total Views
        const totalViewsResult = await pool.query('SELECT COUNT(*) FROM analytics');
        const totalViews = parseInt(totalViewsResult.rows[0].count);

        // Unique Visitors (by IP)
        const uniqueVisitorsResult = await pool.query('SELECT COUNT(DISTINCT ip_address) FROM analytics');
        const uniqueVisitors = parseInt(uniqueVisitorsResult.rows[0].count);

        // Recent Visits (last 50)
        const recentVisitsResult = await pool.query(`
            SELECT id, page_url, ip_address, created_at 
            FROM analytics 
            ORDER BY created_at DESC 
            LIMIT 50
        `);

        // Views over time (last 7 days)
        const viewsOverTimeResult = await pool.query(`
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM analytics
            WHERE created_at >= NOW() - INTERVAL '7 days'
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
        `);

        res.json({
            totalViews,
            uniqueVisitors,
            recentVisits: recentVisitsResult.rows,
            viewsOverTime: viewsOverTimeResult.rows
        });
    } catch (error) {
        console.error('Error fetching analytics stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

module.exports = {
    trackView,
    getStats
};
