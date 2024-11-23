const { excluirEvento } = require('../../src/controllers/eventoController.js');
const Evento = require('../../src/models/evento.js');

jest.mock('../../src/models/evento');

describe('excluirEvento', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                id: 1, 
            },
            session: {
                usuario: { id: 2 },
            },
        };

        res = {
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            render: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve excluir o evento com sucesso e redirecionar para /home', async () => {
        const eventoMock = { id: 1, id_criador: 2 };

        Evento.procurarPorId.mockResolvedValue(eventoMock);
        Evento.deletar.mockResolvedValue();

        await excluirEvento(req, res);

        expect(Evento.procurarPorId).toHaveBeenCalledWith(1);
        expect(Evento.deletar).toHaveBeenCalledWith(1);
        expect(res.redirect).toHaveBeenCalledWith('/home');
    });

    test('Deve retornar 403 se o usuário não tiver permissão para excluir o evento', async () => {
        const eventoMock = { id: 1, id_criador: 3 }; 

        Evento.procurarPorId.mockResolvedValue(eventoMock);

        await excluirEvento(req, res);

        expect(Evento.procurarPorId).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith('Você não tem permissão para excluir este evento');
    });

    test('Deve renderizar a home com erro_exclusao em caso de exceção', async () => {
        const erroMock = new Error('Erro ao excluir evento');

        Evento.procurarPorId.mockRejectedValue(erroMock);

        await excluirEvento(req, res);

        expect(Evento.procurarPorId).toHaveBeenCalledWith(1);
        expect(res.render).toHaveBeenCalledWith('home.html', { erro_exclusao: true });
    });
});
