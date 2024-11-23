const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const db = require('./src/config/db');
const verificarAutenticacao = require('./src/middlewares/autenticacaoMiddleware');
const request = require('supertest');

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
  cookie: { secure: false }
}));

// Middleware global para verificar autenticação em todas as rotas, exceto as publicas
app.use(verificarAutenticacao);

// Função para tentar conexão com o banco de dados várias vezes
const testDatabaseConnection = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      const [rows] = await db.query('SHOW TABLES');
      console.log('Tabelas no banco de dados completa_ai:', rows);
      return; // Conexão bem-sucedida, sai do loop
    } catch (err) {
      console.error(`Erro ao testar conexão com o banco de dados. Tentativas restantes: ${retries - 1}`);
      retries--;
      if (retries === 0) {
        console.error('Todas as tentativas de conexão falharam:', err.message);
        process.exit(1); // Encerra o processo se falhar em todas as tentativas
      }
      await new Promise(resolve => setTimeout(resolve, delay)); // Aguarda antes da próxima tentativa
    }
  }
};

// Inicia a verificação de conexão com o banco antes de carregar as rotas
testDatabaseConnection().then(() => {
  // Rotas do organizador de eventos e usuários
  app.use('/', require('./src/routes/eventoRoutes'));
  app.use('/', require('./src/routes/usuarioRoutes'));
  app.use('/', require('./src/routes/autenticacaoRoutes'));

  // Inicia o servidor após a conexão com o banco ser verificada
  const app_port = 8080;
  app.listen(app_port, () => {
    console.log(`App rodando na porta ${app_port}`);
  });
}).catch(err => {
  console.error('Erro fatal ao iniciar a aplicação:', err.message);
  process.exit(1);
});