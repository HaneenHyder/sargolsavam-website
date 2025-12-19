const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();

// CRITICAL: Railway requires PORT environment variable
const PORT = process.env.PORT;

if (!PORT) {
    console.error('❌ PORT not provided by Railway');
    process.exit(1);
}

// ============================================
// HEALTH CHECKS (MUST BE FIRST - Before Middleware)
// ============================================
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: "healthy" });
});

app.head('/', (req, res) => {
    res.status(200).end();
});

// ============================================
// MIDDLEWARE
// ============================================
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

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
    try {
        require('dotenv').config();
    } catch (e) {
        console.log('⚠️ dotenv not loaded:', e.message);
    }
}

// ============================================
// ROUTES (with error handling for imports)
// ============================================
try {
    const authRoutes = require('./src/routes/auth');
    app.use('/api/auth', authRoutes);
    console.log('✅ Auth routes loaded');
} catch (error) {
    console.error('❌ Error loading auth routes:', error.message);
}

try {
    const eventRoutes = require('./src/routes/events');
    app.use('/api/events', eventRoutes);
    console.log('✅ Event routes loaded');
} catch (error) {
    console.error('❌ Error loading event routes:', error.message);
}

try {
    const participantRoutes = require('./src/routes/participants');
    app.use('/api/participants', participantRoutes);
    console.log('✅ Participant routes loaded');
} catch (error) {
    console.error('❌ Error loading participant routes:', error.message);
}

try {
    const candidateRoutes = require('./src/routes/candidates');
    app.use('/api/candidates', candidateRoutes);
    console.log('✅ Candidate routes loaded');
} catch (error) {
    console.error('❌ Error loading candidate routes:', error.message);
}

try {
    const teamRoutes = require('./src/routes/teams');
    app.use('/api/teams', teamRoutes);
    console.log('✅ Team routes loaded');
} catch (error) {
    console.error('❌ Error loading team routes:', error.message);
}

try {
    const adminRoutes = require('./src/routes/admin');
    app.use('/api/admin', adminRoutes);
    console.log('✅ Admin routes loaded');
} catch (error) {
    console.error('❌ Error loading admin routes:', error.message);
}

try {
    const uploadRoutes = require('./src/routes/uploads');
    app.use('/api/uploads', uploadRoutes);
    console.log('✅ Upload routes loaded');
} catch (error) {
    console.error('❌ Error loading upload routes:', error.message);
}

try {
    const resultRoutes = require('./src/routes/results');
    app.use('/api/results', resultRoutes);
    console.log('✅ Result routes loaded');
} catch (error) {
    console.error('❌ Error loading result routes:', error.message);
}

try {
    const committeeRoutes = require('./src/routes/committee');
    app.use('/api/committee', committeeRoutes);
    console.log('✅ Committee routes loaded');
} catch (error) {
    console.error('❌ Error loading committee routes:', error.message);
}

try {
    const scheduleRoutes = require('./src/routes/schedule');
    app.use('/api/schedule', scheduleRoutes);
    console.log('✅ Schedule routes loaded');
} catch (error) {
    console.error('❌ Error loading schedule routes:', error.message);
}

try {
    const appealsRoutes = require('./src/routes/appeals');
    app.use('/api/appeals', appealsRoutes);
    console.log('✅ Appeals routes loaded');
} catch (error) {
    console.error('❌ Error loading appeals routes:', error.message);
}

try {
    const paymentsRoutes = require('./src/routes/payments');
    app.use('/api/payments', paymentsRoutes);
    console.log('✅ Payments routes loaded');
} catch (error) {
    console.error('❌ Error loading payments routes:', error.message);
}

// Public Analytics Route
try {
    const analyticsController = require('./src/controllers/analyticsController');
    app.post('/api/analytics', analyticsController.trackView);
    console.log('✅ Analytics route loaded');
} catch (error) {
    console.error('❌ Error loading analytics controller:', error.message);
}

// ============================================
// ERROR HANDLING MIDDLEWARE
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
try {
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log('=================================');
        console.log(`✅ Server listening on port ${PORT}`);
        console.log(`📍 Host: 0.0.0.0:${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Supabase configured: ${!!process.env.SUPABASE_URL}`);
        console.log('=================================');
    });

    server.on('error', (error) => {
        console.error('❌ Server Error:', error);
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use`);
            process.exit(1);
        } else if (error.code === 'EACCES') {
            console.error(`Port ${PORT} requires elevated privileges`);
            process.exit(1);
        }
    });

    // ============================================
    // GRACEFUL SHUTDOWN HANDLERS
    // ============================================
    process.on('SIGTERM', () => {
        console.log('⚠️ SIGTERM signal received: closing HTTP server');
        server.close(() => {
            console.log('✅ HTTP server closed');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        console.log('⚠️ SIGINT signal received: closing HTTP server');
        server.close(() => {
            console.log('✅ HTTP server closed');
            process.exit(0);
        });
    });

    // ============================================
    // GLOBAL ERROR HANDLERS
    // ============================================
    process.on('uncaughtException', (error) => {
        console.error('❌ UNCAUGHT EXCEPTION:', error);
        console.error('Stack:', error.stack);
        // In production, you might want to restart the process
        // For now, we'll log and continue
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ UNHANDLED PROMISE REJECTION:', reason);
        console.error('Promise:', promise);
        // In production, you might want to restart the process
    });

} catch (error) {
    console.error('❌ FATAL: Failed to start server:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
}
