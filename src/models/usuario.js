const db = require('../config/db');  // Arquivo de conexão com o banco

// Função para criar um usuario
exports.criar = (usuarioData) => {
    const { email, senha, nome, data_nascimento } = usuarioData;
    const query = `INSERT INTO usuarios (email, senha, nome, data_nascimento) VALUES (?, ?, ?, ?)`;

    return db.execute(query, [email, senha, nome, data_nascimento]);
};

exports.editar = (id, usuarioData) => {
    const { email, senha, nome, data_nascimento } = usuarioData;
    const query = 'UPDATE usuarios SET email = ?, senha = ?, nome = ?, data_nascimento = ? WHERE id = ?';

    return db.execute(query, [email, senha, nome, data_nascimento, id]);
};

// Função para remover um evento
exports.deletar = (id) => {
    const query = 'DELETE FROM usuarios WHERE id = ?';

    return db.execute(query, [id]);  // Retorna uma Promise que resolve com o resultado da exclusão
};

// Função para listar todos os usuarios
exports.procurarTodos = () => {
    const query = 'SELECT * FROM usuarios';
    return db.execute(query).then(([rows]) => rows);  // Retorne apenas o array de resultados
};

// Função para encontrar um evento por ID
exports.procurarPorId = (id) => {
    const query = 'SELECT * FROM usuarios WHERE id = ?';

    return db.execute(query, [id])
        .then(([rows]) => {
            if (rows.length > 0) {
                return rows[0];  // Retorna o usuario encontrado
            } else {
                return null;  // Caso não encontre o usuario
            }
        });
};

exports.adicionarUsuarioAoEvento = (idUsuario, idEvento) => {
    const query = 'INSERT INTO eventos_usuarios (id_usuario, id_evento) VALUES (?, ?)';
    return db.execute(query, [idUsuario, idEvento]);
}

exports.removerUsuarioDoEvento = (idUsuario, idEvento) => {
    const query = 'DELETE FROM eventos_usuarios WHERE id_usuario = ? AND id_evento = ?';
    return db.execute(query, [idUsuario, idEvento]);
}

exports.verificarUsuarioInscrito = (idUsuario, idEvento) => {
    console.log('idUsuario:', idUsuario);
    console.log('idEvento:', idEvento);
    const query = 'SELECT * FROM eventos_usuarios WHERE id_usuario = ? AND id_evento = ?';
    return db.execute(query, [idUsuario, idEvento])
        .then(([rows]) => rows.length > 0);
}