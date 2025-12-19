const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Global error handlers (MUST BE FIRST)
process.on('uncaughtException', (error) => {
    console.error('❌ UNCAUGHT EXCEPTION:', error);
    console.error('Stack:', error.stack);
    // Don't exit the process - let the container keep running
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ UNHANDLED PROMISE REJECTION:', reason);
    console.error('Promise:', promise);
    // Don't exit the process - let the container keep running
});

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
const PORT = process.env.PORT || 8080;

// Health Checks (MUST BE FIRST - Before Middleware)
// Railway requires simple 'OK' response
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: "healthy" });
});

app.head('/', (req, res) => {
    res.status(200).end();
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: [
        /\.vercel\.app$/,
        "https://sargolsavam.azharululoom.net"
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

if ((process.env.NODE_ENV || '').trim() !== 'production') {
    require('dotenv').config();
}

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

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server with error handling
try {
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        console.log(`Supabase URL configured: ${!!process.env.SUPABASE_URL}`);
    });

    server.on('error', (error) => {
        console.error('❌ Server Error:', error);
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use`);
        }
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', () => {
        console.log('⚠️ SIGTERM received, closing server gracefully...');
        server.close(() => {
            console.log('✅ Server closed gracefully');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        console.log('⚠️ SIGINT received, closing server gracefully...');
        server.close(() => {
            console.log('✅ Server closed gracefully');
            process.exit(0);
        });
    });
} catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Stack:', error.stack);
    // Don't exit - let the container stay alive for debugging
}

