const mysql = require('mysql2');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    process.exit(1);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

module.exports = db;
