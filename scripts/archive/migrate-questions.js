const { Pool } = require('pg');

// Source database (homepage)
const sourcePool = new Pool({
  connectionString: process.env.COCKROACHDB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

// Target database (spoke) - same connection for now
const targetPool = new Pool({
  connectionString: process.env.COCKROACHDB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

async function migrateQuestions() {
  try {
    console.log('Starting question migration...');
    
    // First, check if the target table exists with correct schema
    const tableCheck = await targetPool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'trivia_questions'
    `);
    
    console.log('Current table schema:', tableCheck.rows.map(row => `${row.column_name}: ${row.data_type}`));
    
    // Check if we have questions in the source
    const sourceCount = await sourcePool.query('SELECT COUNT(*) FROM trivia_questions WHERE is_approved = true');
    console.log(`Found ${sourceCount.rows[0].count} approved questions in source database`);
    
    if (sourceCount.rows[0].count === 0) {
      console.log('No questions to migrate. Please add sample questions first.');
      return;
    }
    
    // Get all approved questions from source
    const sourceQuestions = await sourcePool.query(`
      SELECT id, question, image_url, options, correct_answer, explanation, category, difficulty, is_approved, created_at
      FROM trivia_questions 
      WHERE is_approved = true
      ORDER BY id
    `);
    
    console.log(`Migrating ${sourceQuestions.rows.length} questions...`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const question of sourceQuestions.rows) {
      try {
        // Check if question already exists in target
        const existing = await targetPool.query('SELECT id FROM trivia_questions WHERE id = $1', [question.id]);
        
        if (existing.rows.length > 0) {
          console.log(`Question ${question.id} already exists, skipping...`);
          skippedCount++;
          continue;
        }
        
        // Insert question into target database
        const sql = `
          INSERT INTO trivia_questions 
          (id, question, image_url, options, correct_answer, explanation, category, difficulty, is_approved, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id
        `;
        
        const params = [
          question.id,
          question.question,
          question.image_url,
          question.options,
          question.correct_answer,
          question.explanation,
          question.category || 'horror',
          question.difficulty || 1,
          question.is_approved,
          question.created_at
        ];
        
        await targetPool.query(sql, params);
        console.log(`Migrated question ${question.id}: ${question.question.substring(0, 50)}...`);
        migratedCount++;
        
      } catch (error) {
        console.error(`Error migrating question ${question.id}:`, error.message);
      }
    }
    
    console.log(`Migration complete! Migrated: ${migratedCount}, Skipped: ${skippedCount}`);
    
    // Final count check
    const finalCount = await targetPool.query('SELECT COUNT(*) FROM trivia_questions WHERE is_approved = true');
    console.log(`Total approved questions in target database: ${finalCount.rows[0].count}`);
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await sourcePool.end();
    await targetPool.end();
  }
}

// Run migration
migrateQuestions();
