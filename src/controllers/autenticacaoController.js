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

const exibirHome = async (req, res) => {
    try {
        verificarAutenticacao(req, res, async () => {
            // Obtém o ID do usuário logado
            const usuarioId = req.session.usuario.id;

            // Chama listarEventos para buscar os eventos
            const todosOsEventos = await eventoController.listarEventos();
            const eventosDoUsuario = await eventoController.listarEventosPorCriador(usuarioId);
            const eventosInscritos = await eventoController.listarEventosInscritos(usuarioId);

            // Renderiza a home com as informações dos eventos e do usuário logado
            const usuarioLogado = true; // Definindo diretamente como true, pois a autenticação passou
            res.render('home.html', { usuarioLogado, usuarioId, todosOsEventos, eventosDoUsuario, eventosInscritos });
        });
    } catch (erro) {
        console.error('Erro ao exibir a home:', erro);
        res.render('home.html', { erro_listagem: true });
    }
};

module.exports = {
    fazerLogin,
    exibirLogin,
    fazerLogout,
    exibirHome
};
