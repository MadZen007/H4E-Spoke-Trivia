'use strict';
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.COCKROACHDB_CONNECTION_STRING,
	ssl: { rejectUnauthorized: false }
});

async function main() {
	try {
		const cols = await pool.query(`
			SELECT column_name, data_type, is_nullable, column_default
			FROM information_schema.columns
			WHERE table_schema = 'public' AND table_name = 'trivia_questions'
			ORDER BY ordinal_position
		`);
		console.log('trivia_questions columns:');
		console.table(cols.rows);

		const count = await pool.query('SELECT COUNT(*)::int AS total FROM trivia_questions');
		console.log('Rows:', count.rows[0].total);
	} catch (e) {
		console.error('Error:', e.message);
		console.error(e.stack);
		process.exit(1);
	} finally {
		await pool.end();
	}
}
main();