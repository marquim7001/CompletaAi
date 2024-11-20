const eventoController = require('../controllers/eventoController');

const carregarDadosCompartilhados = async (req, res, next) => {
    try {
        let usuarioId = null;
        let eventosDoUsuario = [];
        let eventosInscritos = [];
        let todosOsEventos = [];

        if (req.session && req.session.usuario) {
            usuarioId = req.session.usuario.id;

            eventosDoUsuario = await eventoController.listarEventosPorCriador(usuarioId);
            eventosInscritos = await eventoController.listarEventosInscritos(usuarioId);
        }

        todosOsEventos = await eventoController.listarEventos();

        res.locals.usuarioId = usuarioId;
        res.locals.eventosDoUsuario = eventosDoUsuario;
        res.locals.eventosInscritos = eventosInscritos;
        res.locals.todosOsEventos = todosOsEventos;

        next();
    } catch (erro) {
        console.error('Erro ao carregar dados compartilhados:', erro);
        next(erro);
    }
};

module.exports = carregarDadosCompartilhados;
