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
