require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.COCKROACHDB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS trivia_questions (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      image_url TEXT,
      options JSONB NOT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      category TEXT DEFAULT 'horror',
      difficulty INTEGER DEFAULT 1,
      is_approved BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();