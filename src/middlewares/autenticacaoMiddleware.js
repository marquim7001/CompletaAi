const verificarAutenticacao = (req, res, next) => {
    if (req.session && req.session.usuario) {
      next(); // O usuário está autenticado, prossiga para a rota
    } else {
      res.redirect('/login'); // Redireciona para a página de login se não estiver autenticado
    }
  };