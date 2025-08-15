'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.COCKROACHDB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

const QUESTIONS_FILE = path.resolve(__dirname, '..', 'data', 'questions.json');
const BATCH_SIZE = 100;

function normalizeQuestion(raw) {
  const id = Number(raw.id);
  if (!Number.isInteger(id)) throw new Error('Invalid id');
  const question = String(raw.question || '').trim();
  if (!question) throw new Error('Missing question for id ' + id);
  const imageUrl = raw.image ? String(raw.image) : null;
  const options = Array.isArray(raw.options) ? raw.options.map(String) : [];
  if (options.length < 2) throw new Error('Options < 2 for id ' + id);
  const correctAnswer = String(raw.correctAnswer || raw.correct_answer || '').trim();
  if (!correctAnswer || !options.includes(correctAnswer)) {
    throw new Error('correctAnswer not in options for id ' + id);
  }
  const explanation = raw.explanation ? String(raw.explanation) : null;

  return {
    id,
    question,
    image_url: imageUrl,
    options,
    correct_answer: correctAnswer,
    explanation,
    category: 'horror',
    difficulty: 1,
    is_approved: true
  };
}

async function ensureSchema() {
  // Idempotent; table already migrated but keep for safety
  await pool.query('ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS options JSONB DEFAULT \'[]\'::JSONB');
  await pool.query('ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS category STRING DEFAULT \'horror\'');
  await pool.query('ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS difficulty INT DEFAULT 1');
  await pool.query('ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS is_approved BOOL DEFAULT false');
  await pool.query('ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
  await pool.query('ALTER TABLE trivia_questions ALTER COLUMN options SET NOT NULL');
}

async function upsertBatch(client, items) {
  const sql = 'INSERT INTO trivia_questions ' +
    '(id, question, image_url, options, correct_answer, explanation, category, difficulty, is_approved, updated_at) ' +
    'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW()) ' +
    'ON CONFLICT (id) DO UPDATE SET ' +
    'question = EXCLUDED.question, ' +
    'image_url = EXCLUDED.image_url, ' +
    'options = EXCLUDED.options, ' +
    'correct_answer = EXCLUDED.correct_answer, ' +
    'explanation = EXCLUDED.explanation, ' +
    'category = EXCLUDED.category, ' +
    'difficulty = EXCLUDED.difficulty, ' +
    'is_approved = EXCLUDED.is_approved, ' +
    'updated_at = NOW()';

  for (const q of items) {
    const params = [
      q.id,
      q.question,
      q.image_url,
      JSON.stringify(q.options),
      q.correct_answer,
      q.explanation,
      q.category,
      q.difficulty,
      q.is_approved
    ];
    await client.query(sql, params);
  }
}

async function importFromFile() {
  console.log('Reading file:', QUESTIONS_FILE);
  const text = fs.readFileSync(QUESTIONS_FILE, 'utf8');
  const rawData = JSON.parse(text);
  if (!Array.isArray(rawData)) throw new Error('questions.json must be an array');

  // Normalize and filter
  const normalized = [];
  for (const raw of rawData) {
    try {
      normalized.push(normalizeQuestion(raw));
    } catch (e) {
      console.warn('Skip id:', raw && raw.id, '-', e.message);
    }
  }
  console.log('Normalized items:', normalized.length);

  await ensureSchema();

  const client = await pool.connect();
  try {
    let upserts = 0;
    for (let i = 0; i < normalized.length; i += BATCH_SIZE) {
      const batch = normalized.slice(i, i + BATCH_SIZE);
      await client.query('BEGIN');
      try {
        await upsertBatch(client, batch);
        await client.query('COMMIT');
        upserts += batch.length;
        console.log('Upserted', upserts, '/', normalized.length);
      } catch (e) {
        await client.query('ROLLBACK');
        console.error('Batch failed:', e.message);
        throw e;
      }
    }
    console.log('Done. Upserted', upserts, 'questions.');
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  importFromFile().catch(err => {
    console.error('Import failed:', err.message);
    process.exit(1);
  });
}