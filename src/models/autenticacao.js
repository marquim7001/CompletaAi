const bcrypt = require('bcrypt');
const db = require('../config/db');  // Conexão com o banco de dados

// Função para autenticar o usuário
exports.autenticar = async (email, senha) => {
    const query = `SELECT * FROM usuarios WHERE email = ?`;
    
    // Como o e-mail é único, só esperamos um resultado
    const [rows] = await db.execute(query, [email]);
    
    // Se não encontrou o usuário
    if (rows.length === 0) {
        return null;
    }

    const usuario = rows[0];
    // Comparar a senha fornecida com a senha armazenada
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    // Retornar o usuário se a senha estiver correta
    return senhaCorreta ? usuario : null;
};
