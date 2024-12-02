const { exibirPaginaEventos } = require('../../src/controllers/eventoController.js');

describe('exibirPaginaEventos', () => {
    let req, res;

    beforeEach(() => {
        req = {};

        res = {
            locals: {
                usuarioId: 1,
                eventosDoUsuario: [{ id: 1, nome: 'Evento do Usuário' }],
                eventosInscritos: [{ id: 2, nome: 'Evento Inscrito' }],
                todosOsEventos: [{ id: 3, nome: 'Todos os Eventos' }],
            },
            render: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve renderizar eventos.html com os dados corretos', async () => {
        await exibirPaginaEventos(req, res);

        expect(res.render).toHaveBeenCalledWith('eventos.html', {
            usuarioLogado: true,
            usuarioId: 1,
            eventosDoUsuario: [{ id: 1, nome: 'Evento do Usuário' }],
            eventosInscritos: [{ id: 2, nome: 'Evento Inscrito' }],
            todosOsEventos: [{ id: 3, nome: 'Todos os Eventos' }],
        });
    });

    test('Deve renderizar eventos.html com erro_listagem em caso de exceção', async () => {
        res.locals = {};
        res.render.mockImplementationOnce(() => {
            throw new Error('Erro simulado');
        });

        await exibirPaginaEventos(req, res);

        expect(res.render).toHaveBeenCalledWith('eventos.html', { erro_listagem: true });
    });
});
