const Autenticacao = require('../models/autenticacao');

const fazerLogin = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Tenta autenticar o usuário
        const usuario = await Autenticacao.autenticar(email, senha);

        if (!usuario) {
            // Login falhou
            return res.status(401).render('login.html', { erro_login: true });
        }

        // Login bem-sucedido, salva na sessão
        req.session.usuario = usuario;
        res.redirect('/home');  // Redireciona após login bem-sucedido
    } catch (erro) {
        console.error('Erro ao fazer login:', erro);
        res.status(500).send('Erro ao fazer login');
    }
};

const fazerLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao fazer logout');
        }
        res.redirect('/login'); // Redireciona para a página de login
    });
};

const exibirLogin = (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/home');  // Se o usuário já estiver logado, redireciona para a home
    }
    res.render('login.html');
};

module.exports = {
    fazerLogin,
    exibirLogin,
    fazerLogout
};
