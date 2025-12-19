#!/usr/bin/env node

/**
 * Enhanced startup script with detailed diagnostics
 * This will help identify what's causing the container to crash
 */

console.log('🚀 Starting diagnostics...\n');

// Check Node.js version
console.log('📦 Node.js version:', process.version);
console.log('📦 Platform:', process.platform);
console.log('📦 Architecture:', process.arch);
console.log('');

// Check environment variables
console.log('🔧 Environment Variables:');
console.log('  PORT:', process.env.PORT || '(not set)');
console.log('  NODE_ENV:', process.env.NODE_ENV || '(not set)');
console.log('  SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('  SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅ Set' : '❌ Not set');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set');
console.log('');

// Try to require each module individually to find the problematic one
console.log('📚 Testing module imports...\n');

const modules = [
    { name: 'express', path: 'express' },
    { name: 'cors', path: 'cors' },
    { name: 'helmet', path: 'helmet' },
    { name: 'cookie-parser', path: 'cookie-parser' },
    { name: 'auth routes', path: './src/routes/auth' },
    { name: 'event routes', path: './src/routes/events' },
    { name: 'participant routes', path: './src/routes/participants' },
    { name: 'candidate routes', path: './src/routes/candidates' },
    { name: 'team routes', path: './src/routes/teams' },
    { name: 'admin routes', path: './src/routes/admin' },
    { name: 'upload routes', path: './src/routes/uploads' },
    { name: 'result routes', path: './src/routes/results' },
    { name: 'committee routes', path: './src/routes/committee' },
    { name: 'schedule routes', path: './src/routes/schedule' },
    { name: 'appeals routes', path: './src/routes/appeals' },
    { name: 'payments routes', path: './src/routes/payments' },
];

let allModulesOk = true;

for (const module of modules) {
    try {
        require(module.path);
        console.log(`  ✅ ${module.name}`);
    } catch (error) {
        console.error(`  ❌ ${module.name}: ${error.message}`);
        allModulesOk = false;
    }
}

console.log('');

if (!allModulesOk) {
    console.error('❌ Some modules failed to load. Fix these issues before starting the server.\n');
    process.exit(1);
}

console.log('✅ All modules loaded successfully!\n');

// Now start the actual server
console.log('🚀 Starting server...\n');
require('./index.js');
