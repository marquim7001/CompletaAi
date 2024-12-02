const { exibirHome } = require('../../src/controllers/autenticacaoController.js');

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

    test('Deve renderizar a página home com os dados do usuário e eventos', () => {
        exibirHome(req, res);

        expect(res.render).toHaveBeenCalledWith('home.html', {
            usuarioLogado: true,
            usuarioId: 1,
            eventosDoUsuario: [{ id: 1, nome: 'Evento A' }],
            eventosInscritos: [{ id: 2, nome: 'Evento B' }],
            todosOsEventos: [{ id: 1, nome: 'Evento A' }, { id: 2, nome: 'Evento B' }],
        });
    });

    test('Deve renderizar a página home com erro_listagem em caso de exceção', () => {
        res.locals = null;

        exibirHome(req, res);

        expect(res.render).toHaveBeenCalledWith('home.html', { erro_listagem: true });
    });
});
