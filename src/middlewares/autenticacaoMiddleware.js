const verificarAutenticacao = (req, res, next) => {
  const paginasPublicas = ['/login', '/cadastro', '/home', '/sobre'];

  if (paginasPublicas.includes(req.path)) {
      return next(); // Se estiver acessando algumas das paginas publicas, não verifica a autenticação
  }

  if (req.session && req.session.usuario) {
      next(); // Usuário autenticado, prossiga
  } else {
      res.redirect('/home'); // Redireciona para o login se não estiver autenticado
  }
};

module.exports = verificarAutenticacao;