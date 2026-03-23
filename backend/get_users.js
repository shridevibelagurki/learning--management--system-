const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [rows] = await connection.execute('SELECT id, email FROM users LIMIT 10');
  const fs = require('fs');
  fs.writeFileSync('users_output.json', JSON.stringify(rows, null, 2));
  console.log('Written to users_output.json');
  await connection.end();
}

main().catch(console.error);
