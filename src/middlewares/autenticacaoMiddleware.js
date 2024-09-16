const verificarAutenticacao = (req, res, next) => {
  const paginasPublicas = ['/login', '/cadastro'];

  if (paginasPublicas.includes(req.path)) {
      return next(); // Se estiver acessando /login ou /cadastro, não verifica a autenticação
  }

  if (req.session && req.session.usuario) {
      next(); // Usuário autenticado, prossiga
  } else {
      res.redirect('/login'); // Redireciona para o login se não estiver autenticado
  }
};

module.exports = verificarAutenticacao;