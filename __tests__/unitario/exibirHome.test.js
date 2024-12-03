const { exibirHome } = require('../../src/controllers/autenticacaoController.js');
const eventoController = require('../../src/controllers/eventoController.js');

jest.mock('../../src/controllers/eventoController', () => ({
    listarEventos: jest.fn().mockResolvedValue([{ id: 1, nome: 'Evento A' }, { id: 2, nome: 'Evento B' }]),
    listarEventosPorCategoria: jest.fn().mockResolvedValue([{ id: 3, nome: 'Evento por Categoria' }]),
}));

describe('exibirHome', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            locals: {
                usuarioId: 1,
                eventosDoUsuario: [{ id: 1, nome: 'Evento A' }],
                eventosInscritos: [{ id: 2, nome: 'Evento B' }],
                todosOsEventos: [{ id: 1, nome: 'Evento A' }, { id: 2, nome: 'Evento B' }],
            },
            render: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve renderizar a página home com os dados do usuário e eventos', async () => {
        await exibirHome(req, res);

        expect(res.render).toHaveBeenCalledWith('home.html', {
            usuarioLogado: true,
            usuarioId: 1,
            eventosDoUsuario: [{ id: 1, nome: 'Evento A' }],
            eventosInscritos: [{ id: 2, nome: 'Evento B' }],
            todosOsEventos: [{ id: 1, nome: 'Evento A' }, { id: 2, nome: 'Evento B' }],
        });
    });

    test('Deve renderizar a página home com erro_listagem em caso de exceção', async () => {
        jest.spyOn(eventoController, 'listarEventos').mockImplementation(() => {
            throw new Error('Erro simulado');
        });

        res.locals = null;

        await exibirHome(req, res);

        expect(res.render).toHaveBeenCalledWith('home.html', { erro_listagem: true });
    });
});