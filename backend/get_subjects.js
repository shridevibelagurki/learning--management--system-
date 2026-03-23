const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [rows] = await connection.execute('SELECT id, title FROM subjects');
  const fs = require('fs');
  fs.writeFileSync('subjects_output.json', JSON.stringify(rows, null, 2));
  console.log('Written to subjects_output.json');
  await connection.end();
}

main().catch(console.error);
