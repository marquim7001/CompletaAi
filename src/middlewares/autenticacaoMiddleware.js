const verificarAutenticacao = (req, res, next) => {
    const paginasPublicas = ['/login', '/cadastro', '/sobre', '/'];

    if (paginasPublicas.includes(req.path) || req.path.startsWith('/home')) {
        return next(); // Se for uma página pública, prossegue sem autenticação
    }

    if (req.session && req.session.usuario) {
        next(); // Usuário autenticado, prossiga
    } else {
        res.redirect('/login'); // Redireciona para o login se não estiver autenticado
    }
};

module.exports = verificarAutenticacao;