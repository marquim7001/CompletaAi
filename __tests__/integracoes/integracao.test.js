const request = require('supertest');
const app = require('../../App'); 
const db = require('../../src/config/db'); 
const bcrypt = require('bcryptjs');

describe('Teste de Integração', () => {
  
  beforeEach(async () => {
    
    await db.query('SET FOREIGN_KEY_CHECKS = 0');


    await db.query('TRUNCATE TABLE eventos_usuarios'); 
    await db.query('TRUNCATE TABLE eventos');
    await db.query('TRUNCATE TABLE usuarios');

    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    const senhaHash = await bcrypt.hash('senha123', 10);

    await db.query(`
      INSERT INTO usuarios (id, email, senha, nome) VALUES
      (1, 'teste@exemplo.com', '${senhaHash}', 'Usuário Teste');
    `);
  });

  afterAll(async () => {

    await db.query('SET FOREIGN_KEY_CHECKS = 0');

    await db.query('TRUNCATE TABLE eventos_usuarios');
    await db.query('TRUNCATE TABLE eventos');
    await db.query('TRUNCATE TABLE usuarios');

    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    await db.end();
  });

  it('Deve fazer login com credenciais corretas', async () => {
    const resposta = await request(app)
      .post('/login')
      .send({ email: 'teste@exemplo.com', senha: 'senha123' });

    expect(resposta.status).toBe(302); 
    expect(resposta.headers['location']).toBe('/home'); 
  });

  it('Deve falhar ao tentar login com credenciais incorretas', async () => {
    const resposta = await request(app)
      .post('/login')
      .send({ email: 'teste@exemplo.com', senha: 'senha_errada' });

    expect(resposta.status).toBe(401); 
    expect(resposta.text).toContain('Credenciais inválidas. Tente novamente.'); 
  });

  it('Deve criar um evento com dados válidos', async () => {

    const respostaLogin = await request(app)
      .post('/login') 
      .send({
        email: 'teste@exemplo.com', 
        senha: 'senha123'
      });

    
    expect(respostaLogin.status).toBe(302);
    expect(respostaLogin.headers['location']).toBe('/home');

    
    const respostaCriarEvento = await request(app)
      .post('/criar_evento') 
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
      .set('Cookie', respostaLogin.headers['set-cookie']); 

    
    expect(respostaCriarEvento.status).toBe(302);
    expect(respostaCriarEvento.headers['location']).toBe('/home'); 

    const [eventoInserido] = await db.query('SELECT * FROM eventos WHERE nome = ?', ['Evento Teste']);

 
    expect(eventoInserido).toBeDefined(); 
    expect(eventoInserido.length).toBe(1); 
  });


  it('Deve retornar os detalhes de um evento existente', async () => {
 
    const eventoData = {
      nome: 'Evento Teste Detalhes',
      categoria: 'Tecnologia',
      num_vagas: 100,
      descricao: 'Evento de teste para exibição de detalhes',
      data_inicio: '2024-12-25',
      data_fim: '2024-12-26',
      id_criador: 1, 
      localizacao: 'Sala 102',
      hora_inicio: '19:00',
      hora_fim: '21:00',
    };

    
    await db.query(`
      INSERT INTO eventos (nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim) 
      VALUES ('${eventoData.nome}', '${eventoData.categoria}', ${eventoData.num_vagas}, '${eventoData.descricao}', '${eventoData.data_inicio}', '${eventoData.data_fim}', ${eventoData.id_criador}, '${eventoData.localizacao}', '${eventoData.hora_inicio}', '${eventoData.hora_fim}')
    `);

    
    const respostaLogin = await request(app)
      .post('/login') 
      .send({
        email: 'teste@exemplo.com', 
        senha: 'senha123'
      });

    
    expect(respostaLogin.status).toBe(302);
    expect(respostaLogin.headers['location']).toBe('/home');

    
    const resposta = await request(app)
      .get('/detalhes_evento/1') 
      .set('Cookie', respostaLogin.headers['set-cookie']); 

    
    expect(resposta.status).toBe(200); 

    
    
    expect(resposta.text).toContain(eventoData.nome); 
    expect(resposta.text).toContain(eventoData.descricao); 
  });

  it('Deve excluir um evento existente se o usuário for o criador', async () => {
    
    const eventoData = {
      nome: 'Evento Teste Exclusão',
      categoria: 'Tecnologia',
      num_vagas: 50,
      descricao: 'Evento de teste para exclusão',
      data_inicio: '2024-12-25',
      data_fim: '2024-12-26',
      id_criador: 1,
      localizacao: 'Sala 103',
      hora_inicio: '16:00',
      hora_fim: '18:00',
    };

    await db.query(`
      INSERT INTO eventos (nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim) 
      VALUES ('${eventoData.nome}', '${eventoData.categoria}', ${eventoData.num_vagas}, '${eventoData.descricao}', '${eventoData.data_inicio}', '${eventoData.data_fim}', ${eventoData.id_criador}, '${eventoData.localizacao}', '${eventoData.hora_inicio}', '${eventoData.hora_fim}')
    `);

  
    const respostaLogin = await request(app)
      .post('/login')
      .send({
        email: 'teste@exemplo.com', 
        senha: 'senha123',
      });

    
    expect(respostaLogin.status).toBe(302);
    expect(respostaLogin.headers['location']).toBe('/home');

    
    const cookie = respostaLogin.headers['set-cookie'];

    
    const respostaExclusao = await request(app)
      .post('/excluir_evento/1') 
      .set('Cookie', cookie) 
      .send();

    expect(respostaExclusao.status).toBe(302); 
    expect(respostaExclusao.headers['location']).toBe('/home'); 

    
    const [eventoExcluido, metadata] = await db.query('SELECT * FROM eventos WHERE id = 1');
    console.log('eventoExcluido', eventoExcluido);

   
    expect(eventoExcluido.length).toBe(0); 
  });

  it('Não deve excluir um evento se o usuário não for o criador', async () => {
    
    const eventoData = {
      nome: 'Evento Teste Exclusão',
      categoria: 'Tecnologia',
      num_vagas: 50,
      descricao: 'Evento de teste para exclusão',
      data_inicio: '2024-12-25',
      data_fim: '2024-12-26',
      id_criador: 2, 
      localizacao: 'Sala 103',
      hora_inicio: '16:00',
      hora_fim: '18:00',
    };

    
    await db.query(`
      INSERT INTO eventos (nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim) 
      VALUES ('${eventoData.nome}', '${eventoData.categoria}', ${eventoData.num_vagas}, '${eventoData.descricao}', '${eventoData.data_inicio}', '${eventoData.data_fim}', ${eventoData.id_criador}, '${eventoData.localizacao}', '${eventoData.hora_inicio}', '${eventoData.hora_fim}')
    `);

    
    const respostaLogin = await request(app)
      .post('/login')
      .send({
        email: 'teste@exemplo.com', 
        senha: 'senha123',
      });

    
    expect(respostaLogin.status).toBe(302);
    expect(respostaLogin.headers['location']).toBe('/home');

    
    const cookie = respostaLogin.headers['set-cookie'];
    
    const resposta = await request(app)
      .post('/excluir_evento/1') 
      .set('Cookie', cookie) 
      .send();

    
    expect(resposta.status).toBe(403); 
  });
});
