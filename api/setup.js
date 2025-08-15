'use strict';

require('dotenv').config();
const { Pool } = require('pg');
const express = require('express');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.COCKROACHDB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

router.get('/', async (req, res) => {
  try {
    // trivia_questions (matches what the API/importer expect)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trivia_questions (
        id INT PRIMARY KEY,
        question TEXT NOT NULL,
        image_url TEXT,
        options JSONB NOT NULL,
        correct_answer TEXT NOT NULL,
        explanation TEXT,
        category TEXT DEFAULT 'horror',
        difficulty INT DEFAULT 1,
        is_approved BOOL DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // game_sessions (used by /api/trivia/track)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id SERIAL PRIMARY KEY,
        session_id TEXT UNIQUE NOT NULL,
        user_agent TEXT,
        ip_address TEXT,
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP,
        total_score INT DEFAULT 0,
        questions_answered INT DEFAULT 0,
        correct_answers INT DEFAULT 0,
        max_possible_score INT DEFAULT 0,
        completed BOOLEAN DEFAULT false
      )
    `);

    // question_responses (used by /api/trivia/track)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS question_responses (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        question_id INTEGER NOT NULL,
        selected_answer TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        time_taken INTEGER,
        points_earned INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // site_visits (used by /api/trivia/track)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_visits (
        id SERIAL PRIMARY KEY,
        page_url TEXT,
        user_agent TEXT,
        ip_address TEXT,
        referrer TEXT,
        session_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // member_credits (kept for completeness)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS member_credits (
        id SERIAL PRIMARY KEY,
        member_token TEXT UNIQUE NOT NULL,
        credits INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.json({ success: true, message: 'Database tables created successfully with correct schema!' });
  } catch (error) {
    console.error('Error setting up database:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
