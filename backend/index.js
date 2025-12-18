const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const authRoutes = require('./src/routes/auth');
const eventRoutes = require('./src/routes/events');
const participantRoutes = require('./src/routes/participants');
const candidateRoutes = require('./src/routes/candidates');
const teamRoutes = require('./src/routes/teams');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/uploads');
const resultRoutes = require('./src/routes/results');
const committeeRoutes = require('./src/routes/committee');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://sargolsavam.azharululoom.net'
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    /*
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body));
    }
    */
    next();
});

/* ========================= CPANEL HEALTH CHECK (VERY IMPORTANT) ========================= */
app.get('/', (req, res) => {
    res.json({
        status: "ok",
        service: "sargolsavam-backend",
        uptime: process.uptime()
    });
});

app.head('/', (req, res) => {
    res.status(200).end();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/schedule', require('./src/routes/schedule'));
app.use('/api/appeals', require('./src/routes/appeals'));
app.use('/api/payments', require('./src/routes/payments'));

// Public Analytics Route
const analyticsController = require('./src/controllers/analyticsController');
app.post('/api/analytics', analyticsController.trackView);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
