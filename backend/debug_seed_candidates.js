const seedCandidates = require('./seed-candidates');
const db = require('./src/db');

async function run() {
    try {
        await seedCandidates();
    } catch (err) {
        console.error(err);
    } finally {
        await db.pool.end();
    }
}

run();
