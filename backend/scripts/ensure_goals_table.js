#!/usr/bin/env node
/**
 * Script: ensure_goals_table.js
 * - Checks whether the `goals` table exists in the configured Postgres DB.
 * - If it does not exist, reads the migration SQL file and executes it.
 * - This allows skipping a Prisma migrate when the table is already present.
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const db = require('../src/database/connection');

const MIGRATION_SQL_PATH = path.join(__dirname, '..', 'prisma', 'migrations', '20251109090000_create_goals', 'migration.sql');

async function tableExists(tableName) {
  const sql = `SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = $1
  ) AS exists`;
  const res = await db.query(sql, [tableName]);
  return res.rows[0] && res.rows[0].exists === true;
}

async function runMigrationSql(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Migration SQL file not found: ${filePath}`);
  }

  const sql = fs.readFileSync(filePath, 'utf8');

  // Split into individual statements to avoid issues with long multi-statement queries
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    try {
      await db.query(stmt);
    } catch (err) {
      console.error('Failed to execute statement:', err.message);
      throw err;
    }
  }
}

async function main() {
  try {
    console.log('Checking if `goals` table exists...');
    const exists = await tableExists('goals');
    if (exists) {
      console.log('Table `goals` already exists — skipping migration.');
      await db.closePool();
      process.exit(0);
    }

    console.log('Table `goals` not found — applying migration SQL...');
    await runMigrationSql(MIGRATION_SQL_PATH);
    console.log('Migration applied successfully.');
    await db.closePool();
    process.exit(0);
  } catch (err) {
    console.error('Error ensuring goals table:', err);
    try { await db.closePool(); } catch (e) {}
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
