"use strict";
require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.COCKROACHDB_CONNECTION_STRING, ssl: { rejectUnauthorized: false } });

async function safe(sql, label){ try{ await pool.query(sql); console.log("OK:", label);} catch(e){ console.log("SKIP:", label, "-", e.message); } }

(async () => {
  await safe(`CREATE TABLE IF NOT EXISTS game_sessions (id SERIAL PRIMARY KEY, session_id TEXT UNIQUE NOT NULL)`, "ensure game_sessions table");
  await safe(`ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS user_agent TEXT`, "add user_agent");
  await safe(`ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS ip_address TEXT`, "add ip_address");
  await safe(`ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP`, "add start_time");
  await safe(`ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS end_time TIMESTAMP`, "add end_time");
  await safe(`ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS total_score INT DEFAULT 0`, "add total_score");
  await safe(`ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS questions_answered INT DEFAULT 0`, "add questions_answered");
  await safe(`ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS correct_answers INT DEFAULT 0`, "add correct_answers");
  await safe(`ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS max_possible_score INT DEFAULT 0`, "add max_possible_score");
  await safe(`ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false`, "add completed");

  await safe(`CREATE TABLE IF NOT EXISTS question_responses (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    question_id INTEGER NOT NULL,
    selected_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INTEGER,
    points_earned INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "ensure question_responses table");

  await safe(`CREATE TABLE IF NOT EXISTS site_visits (
    id SERIAL PRIMARY KEY,
    page_url TEXT,
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT,
    session_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "ensure site_visits table");

  await pool.end();
  console.log("Migration complete.");
})();
