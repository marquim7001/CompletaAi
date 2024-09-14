const mysql = require('mysql2/promise');

// Criação da conexão com o banco de dados usando pool de conexões
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'flamengo',
  database: 'completa_ai'  // Coloque o nome do banco de dados
});

// Exporta o pool para uso nos modelos
module.exports = pool;