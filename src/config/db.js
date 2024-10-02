const mysql = require('mysql2/promise');

// Criação da conexão com o banco de dados usando pool de conexões
const pool = mysql.createPool({
  host: 'mysql',  // Use o nome do serviço definido no docker-compose.yml
  // host: 'localhost',  // Usar esse se não estiver usando Docker
  port: 3306,
  user: 'root',
  password: 'flamengo',  // Certifique-se de que essa é a senha correta
  database: 'completa_ai'  // Coloque o nome do banco de dados
});

module.exports = pool;