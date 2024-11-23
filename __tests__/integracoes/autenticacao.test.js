const request = require('supertest');
const app = require('../../App'); // Ajuste o caminho conforme necessário
const db = require('../../src/config/db'); // Conexão com o banco de dados
const bcrypt = require('bcryptjs');

describe('Teste de Integração', () => {
  // Configuração antes de cada teste
  beforeEach(async () => {
    // Desativa verificações de chave estrangeira
    await db.query('SET FOREIGN_KEY_CHECKS = 0');

    // Limpa as tabelas
    await db.query('TRUNCATE TABLE eventos_usuarios'); // Exemplo de tabela dependente
    await db.query('TRUNCATE TABLE eventos');
    await db.query('TRUNCATE TABLE usuarios');

    // Ativa verificações de chave estrangeira novamente
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    // Cria o hash da senha
    const senhaHash = await bcrypt.hash('senha123', 10);

    // Insere os dados necessários com a senha hash
    await db.query(`
      INSERT INTO usuarios (id, email, senha, nome) VALUES
      (1, 'teste@exemplo.com', '${senhaHash}', 'Usuário Teste');
    `);
  });

  // Limpeza após todos os testes
  afterAll(async () => {
    // Desativa verificações de chave estrangeira
    await db.query('SET FOREIGN_KEY_CHECKS = 0');

    // Limpa as tabelas
    await db.query('TRUNCATE TABLE eventos_usuarios'); // Exemplo de tabela dependente
    await db.query('TRUNCATE TABLE eventos');
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
    expect(resposta.text).toContain('Credenciais inválidas. Tente novamente.'); // Verifica se contém erro no HTML
  });

  it('Deve criar um evento com dados válidos', async () => {
    // Passo 1: Simular o login do usuário
    const respostaLogin = await request(app)
      .post('/login') // Substitua pela rota de login da sua aplicação
      .send({
        email: 'teste@exemplo.com', // Use um usuário válido
        senha: 'senha123'
      });

    // Verifica se o login foi bem-sucedido e se o redirecionamento foi para a página /home
    expect(respostaLogin.status).toBe(302);
    expect(respostaLogin.headers['location']).toBe('/home');

    // Passo 2: Agora que o usuário está autenticado, tenta criar o evento
    const respostaCriarEvento = await request(app)
      .post('/criar_evento') // Substitua pela rota de criação de evento
      .send({
        nome: 'Evento Teste',
        categoria: 'Tecnologia',
        'num-vagas': 100,
        descricao: 'Evento de teste',
        'data-inicio': '2024-12-01',
        'data-fim': '2024-12-02',
        localizacao: 'Brasília',
        'hora-inicio': '10:00',
        'hora-fim': '18:00'
      })
      .set('Cookie', respostaLogin.headers['set-cookie']); // Envia o cookie de autenticação

    // Passo 3: Verificar o redirecionamento após a criação do evento
    expect(respostaCriarEvento.status).toBe(302); // Espera o redirecionamento para /home
    expect(respostaCriarEvento.headers['location']).toBe('/home'); // Verifica se o redirecionamento foi correto

    // Passo 4: Verificar se o evento foi criado no banco de dados
    const [eventoInserido] = await db.query('SELECT * FROM eventos WHERE nome = ?', ['Evento Teste']);

    // Verifique se `eventoInserido` existe e tem o formato correto
    expect(eventoInserido).toBeDefined(); // Verifica se o evento foi retornado
    expect(eventoInserido.length).toBe(1); // Verifica se o evento foi inserido corretamente
  });


  it('Deve retornar os detalhes de um evento existente', async () => {
    // Inserir um evento no banco para garantir que há algo para recuperar
    const eventoData = {
      nome: 'Evento Teste Detalhes',
      categoria: 'Tecnologia',
      num_vagas: 100,
      descricao: 'Evento de teste para exibição de detalhes',
      data_inicio: '2024-12-25',
      data_fim: '2024-12-26',
      id_criador: 1, // Criador como usuário 1
      localizacao: 'Sala 102',
      hora_inicio: '19:00',
      hora_fim: '21:00',
    };

    // Inserir o evento no banco de dados
    await db.query(`
      INSERT INTO eventos (nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim) 
      VALUES ('${eventoData.nome}', '${eventoData.categoria}', ${eventoData.num_vagas}, '${eventoData.descricao}', '${eventoData.data_inicio}', '${eventoData.data_fim}', ${eventoData.id_criador}, '${eventoData.localizacao}', '${eventoData.hora_inicio}', '${eventoData.hora_fim}')
    `);

    // Passo 1: Simular o login do usuário
    const respostaLogin = await request(app)
      .post('/login') // Substitua pela rota de login da sua aplicação
      .send({
        email: 'teste@exemplo.com', // Use um usuário válido
        senha: 'senha123'
      });

    // Verifica se o login foi bem-sucedido e se o redirecionamento foi para a página /home
    expect(respostaLogin.status).toBe(302);
    expect(respostaLogin.headers['location']).toBe('/home');

    // Passo 2: Agora que o usuário está autenticado, tenta acessar os detalhes do evento
    const resposta = await request(app)
      .get('/detalhes_evento/1') // Substitua pela rota que exibe os detalhes do evento
      .set('Cookie', respostaLogin.headers['set-cookie']); // Envia o cookie de autenticação

    // Passo 3: Verificar se a resposta é 200 (sucesso)
    expect(resposta.status).toBe(200); // Espera um status 200 para sucesso

    // Passo 4: Verificar se os detalhes do evento estão presentes na resposta
    expect(resposta.text).toContain(eventoData.nome); // Verifica se o nome do evento está presente
    expect(resposta.text).toContain(eventoData.descricao); // Verifica se a descrição está presente
  });

  it('Deve excluir um evento existente se o usuário for o criador', async () => {
    // Inserir um evento no banco para garantir que há algo para excluir
    const eventoData = {
      nome: 'Evento Teste Exclusão',
      categoria: 'Tecnologia',
      num_vagas: 50,
      descricao: 'Evento de teste para exclusão',
      data_inicio: '2024-12-25',
      data_fim: '2024-12-26',
      id_criador: 1, // Criador como usuário 1
      localizacao: 'Sala 103',
      hora_inicio: '16:00',
      hora_fim: '18:00',
    };

    await db.query(`
      INSERT INTO eventos (nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim) 
      VALUES ('${eventoData.nome}', '${eventoData.categoria}', ${eventoData.num_vagas}, '${eventoData.descricao}', '${eventoData.data_inicio}', '${eventoData.data_fim}', ${eventoData.id_criador}, '${eventoData.localizacao}', '${eventoData.hora_inicio}', '${eventoData.hora_fim}')
    `);

    // Passo 1: Simular o login do usuário
    const respostaLogin = await request(app)
      .post('/login')
      .send({
        email: 'teste@exemplo.com', // Use um usuário válido
        senha: 'senha123',
      });

    // Verifica se o login foi bem-sucedido e se o redirecionamento foi para a página /home
    expect(respostaLogin.status).toBe(302);
    expect(respostaLogin.headers['location']).toBe('/home');

    // Captura o cookie da sessão
    const cookie = respostaLogin.headers['set-cookie'];

    // Passo 2: Simular a exclusão do evento com o cookie de sessão
    const respostaExclusao = await request(app)
      .post('/excluir_evento/1') // Tenta excluir o evento com ID 1
      .set('Cookie', cookie) // Envia o cookie para manter a sessão
      .send();

    expect(respostaExclusao.status).toBe(302); // Redireciona após sucesso
    expect(respostaExclusao.headers['location']).toBe('/home'); // Redireciona para a página inicial

    // Verificar se o evento foi realmente excluído
    const [eventoExcluido, metadata] = await db.query('SELECT * FROM eventos WHERE id = 1');
    console.log('eventoExcluido', eventoExcluido);

    // Verifique se o evento foi realmente excluído
    expect(eventoExcluido.length).toBe(0); // O evento não deve mais existir no banco
  });

  it('Não deve excluir um evento se o usuário não for o criador', async () => {
    // Inserir um evento no banco com criador diferente
    const eventoData = {
      nome: 'Evento Teste Exclusão',
      categoria: 'Tecnologia',
      num_vagas: 50,
      descricao: 'Evento de teste para exclusão',
      data_inicio: '2024-12-25',
      data_fim: '2024-12-26',
      id_criador: 2, // Criador como usuário 2
      localizacao: 'Sala 103',
      hora_inicio: '16:00',
      hora_fim: '18:00',
    };

    // Inserção no banco de dados
    await db.query(`
      INSERT INTO eventos (nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim) 
      VALUES ('${eventoData.nome}', '${eventoData.categoria}', ${eventoData.num_vagas}, '${eventoData.descricao}', '${eventoData.data_inicio}', '${eventoData.data_fim}', ${eventoData.id_criador}, '${eventoData.localizacao}', '${eventoData.hora_inicio}', '${eventoData.hora_fim}')
    `);

    // Passo 1: Simular o login do usuário 1 (o usuário que não é o criador)
    const respostaLogin = await request(app)
      .post('/login')
      .send({
        email: 'teste@exemplo.com', // Use um usuário válido
        senha: 'senha123',
      });

    // Verifica se o login foi bem-sucedido e se o redirecionamento foi para a página /home
    expect(respostaLogin.status).toBe(302);
    expect(respostaLogin.headers['location']).toBe('/home');

    // Captura o cookie da sessão
    const cookie = respostaLogin.headers['set-cookie'];
    // Passo 2: Tentar excluir o evento com ID 1 (o usuário logado não é o criador)
    const resposta = await request(app)
      .post('/excluir_evento/1') // Tenta excluir o evento com ID 1, mas o criador é o usuário 2
      .set('Cookie', cookie) // Envia o cookie para manter a sessão
      .send();

    // Espera um status 403 porque o usuário não é o criador do evento
    expect(resposta.status).toBe(403); // Proibido, pois o usuário não é o criador
  });
});
