const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.COCKROACHDB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

const sampleQuestions = [
  {
    question: "What year was the original 'Halloween' movie released?",
    image_url: null,
    options: ["1976", "1978", "1980", "1982"],
    correct_answer: "1978",
    explanation: "John Carpenter's 'Halloween' was released in 1978, introducing the world to Michael Myers.",
    category: "horror",
    difficulty: 1,
    is_approved: true
  },
  {
    question: "Who directed 'The Shining'?",
    image_url: null,
    options: ["Alfred Hitchcock", "Stanley Kubrick", "Steven Spielberg", "Martin Scorsese"],
    correct_answer: "Stanley Kubrick",
    explanation: "Stanley Kubrick directed 'The Shining' in 1980, based on Stephen King's novel.",
    category: "horror",
    difficulty: 1,
    is_approved: true
  },
  {
    question: "What is the name of the killer doll in the 'Child's Play' series?",
    image_url: null,
    options: ["Billy", "Chucky", "Ducky", "Lucky"],
    correct_answer: "Chucky",
    explanation: "Chucky is the killer doll possessed by the soul of serial killer Charles Lee Ray.",
    category: "horror",
    difficulty: 1,
    is_approved: true
  },
  {
    question: "In 'A Nightmare on Elm Street', what is Freddy Krueger's weapon of choice?",
    image_url: null,
    options: ["A knife", "A machete", "Razor-sharp claws", "A chainsaw"],
    correct_answer: "Razor-sharp claws",
    explanation: "Freddy Krueger uses razor-sharp claws on his right hand to kill his victims in their dreams.",
    category: "horror",
    difficulty: 2,
    is_approved: true
  },
  {
    question: "What is the name of the hotel in 'The Shining'?",
    image_url: null,
    options: ["The Overlook Hotel", "The Stanley Hotel", "The Grand Hotel", "The Redrum Hotel"],
    correct_answer: "The Overlook Hotel",
    explanation: "The Overlook Hotel is the haunted hotel where the Torrance family stays in 'The Shining'.",
    category: "horror",
    difficulty: 2,
    is_approved: true
  }
];

async function addSampleQuestions() {
  try {
    console.log('Adding sample questions to database...');
    
    for (const question of sampleQuestions) {
      const sql = `
        INSERT INTO trivia_questions 
        (question, image_url, options, correct_answer, explanation, category, difficulty, is_approved)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `;
      
      const params = [
        question.question,
        question.image_url,
        JSON.stringify(question.options),
        question.correct_answer,
        question.explanation,
        question.category,
        question.difficulty,
        question.is_approved
      ];
      
      const result = await pool.query(sql, params);
      console.log(`Added question ID: ${result.rows[0].id} - ${question.question.substring(0, 50)}...`);
    }
    
    console.log('Sample questions added successfully!');
    
    // Check total count
    const countResult = await pool.query('SELECT COUNT(*) FROM trivia_questions WHERE is_approved = true');
    console.log(`Total approved questions in database: ${countResult.rows[0].count}`);
    
  } catch (error) {
    console.error('Error adding sample questions:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
addSampleQuestions();
