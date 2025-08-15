'use strict';
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.COCKROACHDB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

async function safeExec(sql, label) {
  try {
    await pool.query(sql);
    console.log('OK:', label);
  } catch (e) {
    console.warn('SKIP:', label, '-', e.message);
  }
}

async function main() {
  try {
    // 1) Add new columns the API/importer expect (idempotent)
    await safeExec(
      `ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::JSONB`,
      'add options JSONB'
    );
    await safeExec(
      `ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS category STRING DEFAULT 'horror'`,
      'add category'
    );
    await safeExec(
      `ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS difficulty INT DEFAULT 1`,
      'add difficulty'
    );
    await safeExec(
      `ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS is_approved BOOL DEFAULT false`,
      'add is_approved'
    );
    await safeExec(
      `ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
      'add updated_at'
    );

    // 2) Try to rename approved -> is_approved (if approved exists and rename is allowed)
    await safeExec(
      `ALTER TABLE trivia_questions RENAME COLUMN approved TO is_approved`,
      'rename approved -> is_approved'
    );

    // 3) If approved still exists, copy values into is_approved
    await safeExec(
      `UPDATE trivia_questions SET is_approved = approved WHERE is_approved IS DISTINCT FROM approved`,
      'backfill is_approved from approved'
    );

    // 4) Ensure options is NOT NULL (after default backfill)
    await safeExec(
      `ALTER TABLE trivia_questions ALTER COLUMN options SET NOT NULL`,
      'options SET NOT NULL'
    );

    // 5) Show resulting columns
    const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'trivia_questions'
      ORDER BY ordinal_position
    `);
    console.log('trivia_questions columns after migration:');
    console.table(cols.rows);

  } catch (e) {
    console.error('Migration failed:', e.message);
    console.error(e.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main();
}