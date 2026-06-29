const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();

const PORT = process.env.PORT || 5000;

if (!PORT) {
    console.error('❌ PORT not provided');
    process.exit(1);
}

// ============================================
// HEALTH CHECKS
// ============================================
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: "healthy" });
});

// ============================================
// MIDDLEWARE
// ============================================
app.use(helmet());

// UPDATED CORS: Added your specific Vercel URL
app.use(cors({
    origin: [
        /\.vercel\.app$/,
        "https://sargolsavam.azharululoom.net",
        "https://sargolsavam-website-haneenhyders-projects.vercel.app",
        "http://localhost:3000"
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
    try {
        require('dotenv').config();
    } catch (e) {
        console.log('⚠️ dotenv not loaded:', e.message);
    }
}

// ============================================
// ROUTES
// ============================================
const routeConfigs = [
    { path: '/api/auth', module: './src/routes/auth' },
    { path: '/api/events', module: './src/routes/events' },
    { path: '/api/participants', module: './src/routes/participants' },
    { path: '/api/candidates', module: './src/routes/candidates' },
    { path: '/api/teams', module: './src/routes/teams' },
    { path: '/api/admin', module: './src/routes/admin' },
    { path: '/api/uploads', module: './src/routes/uploads' },
    { path: '/api/results', module: './src/routes/results' },
    { path: '/api/committee', module: './src/routes/committee' },
    { path: '/api/schedule', module: './src/routes/schedule' },
    { path: '/api/appeals', module: './src/routes/appeals' },
    { path: '/api/payments', module: './src/routes/payments' },
    { path: '/api/judges', module: './src/routes/judges' }
];

routeConfigs.forEach(route => {
    try {
        app.use(route.path, require(route.module));
        console.log(`✅ ${route.path} routes loaded`);
    } catch (error) {
        console.error(`❌ Error loading ${route.path} routes:`, error.message);
    }
});

// Public Page View Tracking Route
try {
    const viewerController = require('./src/controllers/viewerController');
    app.post('/api/track-view', viewerController.trackView);
    console.log('✅ Viewer tracking route loaded');
} catch (error) {
    console.error('❌ Error loading viewer controller:', error.message);
}

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
    console.error('❌ Error Handler Caught:', err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
});

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server listening on port ${PORT}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
