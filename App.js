const express = require('express');
const mustacheExpress = require('mustache-express');
const db = require('./src/config/db');  // Conexão com o banco de dados

const app = express();

// Configuração do Mustache como engine de visualização
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/src/views');

// Middleware para parsing do body e servir arquivos estáticos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Teste de conexão com o banco de dados
const testDatabaseConnection = async () => {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('Banco de dados conectado e pronto para uso');
  } catch (err) {
    console.error('Erro ao testar conexão com o banco de dados:', err);
  }
};

testDatabaseConnection();

// Rotas do organizador de eventos
app.use('/', require('./src/routes/eventoRoutes'));
app.use('/', require('./src/routes/usuarioRoutes'));

// Definindo porta e rodando servidor
const app_port = 8080;
app.listen(app_port, () => {
  console.log(`App rodando na porta ${app_port}`);
});
