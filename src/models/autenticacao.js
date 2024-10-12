const bcrypt = require('bcrypt');
const db = require('../config/db');  // Conexão com o banco de dados

// Função para autenticar o usuário
exports.autenticar = async (email, senha) => {
    console.log('Autenticando usuário:', email, senha);
    const query = `SELECT * FROM usuarios WHERE email = ?`;
    
    // Como o e-mail é único, só esperamos um resultado
    const [rows] = await db.execute(query, [email]);
    console.log('Resultado da consulta:', rows);
    // Se não encontrou o usuário
    if (rows.length === 0) {
        return null;
    }

    const usuario = rows[0];
    // Comparar a senha fornecida com a senha armazenada
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    console.log('Senha correta:', senhaCorreta);

    // Retornar o usuário se a senha estiver correta, ou null se incorreta
    return senhaCorreta ? usuario : null;
};
