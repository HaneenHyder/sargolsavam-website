require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function backup() {
    try {
        await client.connect();
        console.log('Connected to database...');

        let sqlOutput = `-- Sargolsavam Database Backup\n-- Created at: ${new Date().toISOString()}\n\n`;

        // 1. Get all tables
        const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
        const tables = tablesRes.rows.map(r => r.table_name);

        for (const table of tables) {
            console.log(`Processing table: ${table}`);

            // 2. Get columns for schema generation
            const columnsRes = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [table]);

            sqlOutput += `-- Table: ${table}\n`;
            sqlOutput += `DROP TABLE IF EXISTS "${table}" CASCADE;\n`;
            sqlOutput += `CREATE TABLE "${table}" (\n`;

            const colDefs = columnsRes.rows.map(col => {
                let def = `  "${col.column_name}" ${col.data_type}`;
                if (col.is_nullable === 'NO') def += ' NOT NULL';
                if (col.column_default) def += ` DEFAULT ${col.column_default}`;
                return def;
            });

            sqlOutput += colDefs.join(',\n');
            sqlOutput += `\n);\n\n`;

            // 3. Get data
            const dataRes = await client.query(`SELECT * FROM "${table}"`);
            if (dataRes.rows.length > 0) {
                sqlOutput += `INSERT INTO "${table}" (${dataRes.fields.map(f => `"${f.name}"`).join(', ')}) VALUES\n`;

                const rows = dataRes.rows.map(row => {
                    const values = dataRes.fields.map(field => {
                        const val = row[field.name];
                        if (val === null) return 'NULL';
                        if (typeof val === 'number') return val;
                        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
                        if (val instanceof Date) return `'${val.toISOString()}'`;
                        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
                        // Escape single quotes for SQL
                        return `'${val.toString().replace(/'/g, "''")}'`;
                    });
                    return `(${values.join(', ')})`;
                });

                sqlOutput += rows.join(',\n');
                sqlOutput += `;\n\n`;
            }
        }

        const outputPath = path.join(__dirname, '..', 'sargolsavam_backup.sql');
        fs.writeFileSync(outputPath, sqlOutput);
        console.log(`Backup completed successfully! Saved to: ${outputPath}`);

    } catch (err) {
        console.error('Backup failed:', err);
    } finally {
        await client.end();
    }
}

backup();
