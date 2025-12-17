const db = require('./src/db');

async function checkAuditLogs() {
    try {
        console.log("Checking audit_logs table...");
        const result = await db.query("SELECT * FROM audit_logs LIMIT 5");
        console.log("Audit Logs:", result.rows);
    } catch (err) {
        console.error("Error querying audit_logs:", err);
    } finally {
        process.exit();
    }
}

checkAuditLogs();
