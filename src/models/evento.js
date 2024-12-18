const db = require('../config/db');  // Arquivo de conexão com o banco

// Função para criar um evento
exports.criar = (eventoData) => {
  console.log('Criando evento no usuario.js:', eventoData);
  const { nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim } = eventoData;
  const query = `INSERT INTO eventos (nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  return db.execute(query, [nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim]);
};

exports.editar = (id, eventoData) => {
  const { nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim } = eventoData;
  const query = 'UPDATE eventos SET nome = ?, categoria = ?, num_vagas = ?, descricao = ?, data_inicio = ?, data_fim = ?, id_criador = ?, localizacao = ?, hora_inicio = ?, hora_fim = ? WHERE id = ?';

  return db.execute(query, [nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim, id]);
};

// Função para remover um evento
exports.deletar = (id) => {
  const query = 'DELETE FROM eventos WHERE id = ?';

  return db.execute(query, [id]);  // Retorna uma Promise que resolve com o resultado da exclusão
};

// Função para listar todos os eventos
exports.procurarTodos = () => {
  const query = 'SELECT * FROM eventos';
  return db.execute(query).then(([rows]) => rows);  // Retorne apenas o array de resultados
};

// Função para listar eventos com base na categoria
exports.procurarPorCategoria = (categoria) => {
  const query = 'SELECT * FROM eventos WHERE categoria = ?';
  return db.execute(query, [categoria]).then(([rows]) => rows);
};

// Função para encontrar um evento por ID
exports.procurarPorId = (id) => {
  const query = 'SELECT * FROM eventos WHERE id = ?';

  return db.execute(query, [id])
    .then(([rows]) => {
      if (rows.length > 0) {
        return rows[0];  // Retorna o evento encontrado
      } else {
        return null;  // Caso não encontre o evento
      }
    });
};

// Função para encontrar os eventos de um criador
exports.procurarPorIdCriador = (id) => {
  const query = 'SELECT * FROM eventos WHERE id_criador = ?';

  return db.execute(query, [id]).then(([rows]) => rows);
}

exports.listarIdsEventosPorIdUsuario = (idUsuario) => {
  const query = 'SELECT * FROM eventos_usuarios WHERE id_usuario = ?';
  return db.execute(query, [idUsuario]).then(([rows]) => rows);
}