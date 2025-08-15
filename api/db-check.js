'use strict';

require('dotenv').config();
const fs = require('fs');
const { Pool } = require('pg');
const { URL } = require('url');

const conn = process.env.COCKROACHDB_CONNECTION_STRING || '';
console.log('HAS_CONN:', !!conn, 'LEN:', conn.length);

let host = null;
let port = null;
let sslmode = null;
let sslrootcert = null;

try {
	const u = new URL(conn);
	host = u.hostname;
	port = u.port || '26257';
	sslmode = u.searchParams.get('sslmode');
	sslrootcert = u.searchParams.get('sslrootcert');
	console.log('TARGET:', host, port, 'sslmode=', sslmode, 'sslrootcert set=', !!sslrootcert);
} catch (e) {
	console.error('Bad connection string:', e.message);
	process.exit(1);
}

// Prefer CA from sslrootcert in the URL, else try a common default path
let ca = null;
const candidatePaths = [];
if (sslrootcert) candidatePaths.push(sslrootcert);
candidatePaths.push('C:\\Users\\Edward Kelly\\AppData\\Roaming\\postgresql\\root.crt');

for (const p of candidatePaths) {
	try {
		if (fs.existsSync(p)) {
			ca = fs.readFileSync(p, 'utf8');
			console.log('Loaded CA from:', p);
			break;
		}
	} catch (e) {
		// keep trying other paths
	}
}

const ssl = ca ? { ca } : { rejectUnauthorized: false };

const pool = new Pool({
	connectionString: conn,
	ssl
});

pool.query('SELECT now() AS now')
	.then(r => {
		console.log('DB OK at', r.rows[0].now);
	})
	.catch(e => {
		console.error('DB ERROR name:', e.name);
		console.error('DB ERROR code:', e.code);
		console.error('DB ERROR message:', e.message);
		console.error('DB ERROR stack:', e.stack);
	})
	.finally(() => pool.end());