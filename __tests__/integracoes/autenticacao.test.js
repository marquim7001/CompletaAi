const request = require('supertest');
const app = require('../../App'); // ajuste o caminho conforme necessário
const db = require('../../src/config/db'); // conexão com o banco de dados

describe('Teste de Integração - Login', () => {
  // Configuração antes de cada teste
  beforeEach(async () => {
    // Desativa verificações de chave estrangeira
    await db.query('SET FOREIGN_KEY_CHECKS = 0');

    // Limpa as tabelas
    await db.query('TRUNCATE TABLE eventos_usuarios'); // Exemplo de tabela dependente
    await db.query('TRUNCATE TABLE usuarios');

    // Ativa verificações de chave estrangeira novamente
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    // Insere os dados necessários
    await db.query(`
      INSERT INTO usuarios (id, email, senha, nome) VALUES
      (1, 'teste@exemplo.com', 'senha123', 'Usuário Teste');
    `);
  });

  // Limpeza após todos os testes
  afterAll(async () => {
    // Desativa verificações de chave estrangeira
    await db.query('SET FOREIGN_KEY_CHECKS = 0');

    // Limpa as tabelas
    await db.query('TRUNCATE TABLE eventos_usuarios'); // Exemplo de tabela dependente
    await db.query('TRUNCATE TABLE usuarios');

    // Ativa verificações de chave estrangeira novamente
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    // Fecha a conexão com o banco de dados
    await db.end();
  });

  it('Deve fazer login com credenciais corretas', async () => {
    const resposta = await request(app)
      .post('/login')
      .send({ email: 'teste@exemplo.com', senha: 'senha123' });

    expect(resposta.status).toBe(302); // Redirecionamento após sucesso
    expect(resposta.headers['location']).toBe('/home'); // Redireciona para /home
  });

  it('Deve falhar ao tentar login com credenciais incorretas', async () => {
    const resposta = await request(app)
      .post('/login')
      .send({ email: 'teste@exemplo.com', senha: 'senha_errada' });

    expect(resposta.status).toBe(401); // Não autorizado
    expect(resposta.text).toContain('erro_login'); // Verifica se contém erro_login no HTML
  });

  it('Deve retornar erro 500 se houver problema no servidor', async () => {
    jest.spyOn(db, 'query').mockImplementationOnce(() => {
      throw new Error('Erro de teste no banco');
    });

    const resposta = await request(app)
      .post('/login')
      .send({ email: 'teste@exemplo.com', senha: 'senha123' });

    expect(resposta.status).toBe(500); // Erro interno do servidor
    jest.restoreAllMocks(); // Restaura o comportamento original
  });
});
