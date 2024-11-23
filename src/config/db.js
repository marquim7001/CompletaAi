require('dotenv').config();
const mysql = require('mysql2/promise');

// usar essa pool com o docker
const pool = mysql.createPool({
  host: 'localhost',
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

//usar essa pool com o railway
// const DATABASE_URL_RAILWAY = `mysql://${process.env.DB_USER_RAILWAY}:${process.env.DB_PASSWORD_RAILWAY}@${process.env.DB_HOST_RAILWAY}:${process.env.DB_PORT_RAILWAY}/${process.env.DB_DATABASE_RAILWAY}`;
// const pool = mysql.createPool(DATABASE_URL_RAILWAY);

module.exports = pool;