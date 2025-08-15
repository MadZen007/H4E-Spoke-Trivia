'use strict';
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.COCKROACHDB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('Resetting trivia_questions table...');
    await pool.query('DROP TABLE IF EXISTS trivia_questions');
    await pool.query(
      "CREATE TABLE trivia_questions (" +
      "  id INT PRIMARY KEY," +
      "  question TEXT NOT NULL," +
      "  image_url TEXT," +
      "  options JSONB NOT NULL," +
      "  correct_answer TEXT NOT NULL," +
      "  explanation TEXT," +
      "  category TEXT DEFAULT 'horror'," +
      "  difficulty INT DEFAULT 1," +
      "  is_approved BOOL DEFAULT false," +
      "  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
      "  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
      ")"
    );
    console.log('Table created.');
  } catch (e) {
    console.error('Setup error:', e.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}
run();