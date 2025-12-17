const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Supabase requires SSL
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        const sqlPath = path.join(__dirname, 'migrations', 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration...');
        await client.query(sql);
        console.log('Migration successful!');

        const committeeSqlPath = path.join(__dirname, 'migrations', 'add_committee_members.sql');
        const committeeSql = fs.readFileSync(committeeSqlPath, 'utf8');
        console.log('Running committee members migration...');
        await client.query(committeeSql);
        console.log('Committee members migration successful!');

        /* 
        const removeDeptSqlPath = path.join(__dirname, 'migrations', 'remove_department.sql');
        const removeDeptSql = fs.readFileSync(removeDeptSqlPath, 'utf8');
        console.log('Running remove department migration...');
        await client.query(removeDeptSql);
        console.log('Remove department migration successful!');
        */

        const displayOrderSqlPath = path.join(__dirname, 'migrations', 'add_display_order.sql');
        if (fs.existsSync(displayOrderSqlPath)) {
            const displayOrderSql = fs.readFileSync(displayOrderSqlPath, 'utf8');
            console.log('Running display order migration...');
            await client.query(displayOrderSql);
            console.log('Display order migration successful!');
        }

        const restoreDeptSqlPath = path.join(__dirname, 'migrations', 'restore_department.sql');
        if (fs.existsSync(restoreDeptSqlPath)) {
            const restoreDeptSql = fs.readFileSync(restoreDeptSqlPath, 'utf8');
            console.log('Running restore department migration...');
            await client.query(restoreDeptSql);
            console.log('Restore department migration successful!');
        }

        const createAppealsSqlPath = path.join(__dirname, 'migrations', 'create_appeals_table.sql');
        if (fs.existsSync(createAppealsSqlPath)) {
            const createAppealsSql = fs.readFileSync(createAppealsSqlPath, 'utf8');
            console.log('Running create appeals table migration...');
            await client.query(createAppealsSql);
            console.log('Create appeals table migration successful!');
        }

        const addPaymentColsSqlPath = path.join(__dirname, 'migrations', 'add_payment_columns.sql');

        if (fs.existsSync(addPaymentColsSqlPath)) {
            const addPaymentColsSql = fs.readFileSync(addPaymentColsSqlPath, 'utf8');
            console.log('Running add payment columns migration...');
            await client.query(addPaymentColsSql);
            console.log('Add payment columns migration successful!');
        }

        const createAnalyticsSqlPath = path.join(__dirname, 'migrations', 'create_analytics_table.sql');
        if (fs.existsSync(createAnalyticsSqlPath)) {
            const createAnalyticsSql = fs.readFileSync(createAnalyticsSqlPath, 'utf8');
            console.log('Running create analytics table migration...');
            await client.query(createAnalyticsSql);
            console.log('Create analytics table migration successful!');
        }

        // Create Admin User if not exists
        const bcrypt = require('bcrypt');
        const hash = await bcrypt.hash('admin123', 10);
        await client.query(`
        INSERT INTO admins (username, password_hash, role) 
        VALUES ('admin', $1, 'admin') 
        ON CONFLICT (username) DO NOTHING
    `, [hash]);
        console.log('Default admin user (admin/admin123) ensured.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

if (require.main === module) {
    runMigration();
}

module.exports = runMigration;
