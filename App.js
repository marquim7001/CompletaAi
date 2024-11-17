const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const db = require('./src/config/db');
const verificarAutenticacao = require('./src/middlewares/autenticacaoMiddleware');

// Configuração do app
const app = express();

// Configuração do Mustache como engine de visualização
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/src/views');

// Middleware para parsing do body e servir arquivos estáticos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Configuração de sessões (autenticação)
app.use(session({
  secret: 'segredo-super-seguro',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true se estiver usando HTTPS
}));

// Middleware global para verificar autenticação em todas as rotas, exceto as publicas
app.use(verificarAutenticacao);

// Teste de conexão com o banco de dados
const testDatabaseConnection = async () => {
  try {
    const [rows] = await db.query('SHOW TABLES');
    if (rows.length > 0) {
      console.log('Tabelas no banco de dados completa_ai:', rows);
    } else {
      console.log('Banco de dados vazio!');
    }
  } catch (err) {
    console.error('Erro ao testar conexão com o banco de dados:', err.message);
    process.exit(1);
  }
};

testDatabaseConnection();

// Rotas
app.use('/', require('./src/routes/eventoRoutes'));
app.use('/', require('./src/routes/usuarioRoutes'));
app.use('/', require('./src/routes/autenticacaoRoutes'));

// Definindo porta e rodando servidor
const app_port = 8080;
app.listen(app_port, () => {
  console.log(`App rodando na porta ${app_port}`);
});
