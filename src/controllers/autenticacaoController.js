const Autenticacao = require('../models/autenticacao');
const eventoController = require('../controllers/eventoController');
const verificarAutenticacao = require('../middlewares/autenticacaoMiddleware');

const fazerLogin = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Tenta autenticar o usuário
        const usuario = await Autenticacao.autenticar(email, senha);

        if (!usuario) {
            // Login falhou
            return res.status(401).render('login.html', { erro_login: true });
        }

        // Login bem-sucedido, salva na sessão (apenas algumas informações)
        req.session.usuario = { id: usuario.id, email: usuario.email, nome: usuario.nome };

        // Redireciona após login bem-sucedido
        res.redirect('/home');
    } catch (erro) {
        console.error('Erro ao fazer login:', erro);
        return res.status(500).send('Erro ao fazer login');
    }
};

const fazerLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao fazer logout');
        }
        res.redirect('/home'); // Redireciona para a home
    });
};

const exibirLogin = (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/home');  // Se o usuário já estiver logado, redireciona para a home
    }
    res.render('login.html');
};

const exibirHome = (req, res) => {
    try {
        const { usuarioId, eventosDoUsuario, eventosInscritos, todosOsEventos } = res.locals;

        res.render('home.html', {
            usuarioLogado: !!usuarioId,
            usuarioId,
            eventosDoUsuario,
            eventosInscritos,
            todosOsEventos
        });
    } catch (erro) {
        console.error('Erro ao exibir a home:', erro);
        res.render('home.html', { erro_listagem: true });
    }
};

const exibirSobre = (req, res) => {
    try {
        const { usuarioId } = res.locals;

        res.render('sobre.html', {
            usuarioLogado: !!usuarioId,
            usuarioId,
        });
    } catch (erro) {
        console.error('Erro ao exibir o sobre:', erro);
        res.render('sobre.html', { erro_listagem: true });
    }
}

module.exports = {
    fazerLogin,
    exibirLogin,
    fazerLogout,
    exibirHome,
    exibirSobre
};
