const { excluirEvento } = require('../../src/controllers/eventoController.js');
const Evento = require('../../src/models/evento.js');

// Mock do modelo Evento
jest.mock('../../src/models/evento');

describe('excluirEvento', () => {
    let req, res;

    beforeEach(() => {
        // Mock do objeto req
        req = {
            params: {
                id: 1, // ID do evento a ser excluído
            },
            session: {
                usuario: { id: 2 }, // Simula o usuário logado
            },
        };

        // Mock do objeto res
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

        // Mock do comportamento do modelo
        Evento.procurarPorId.mockResolvedValue(eventoMock);
        Evento.deletar.mockResolvedValue();

        await excluirEvento(req, res);

        expect(Evento.procurarPorId).toHaveBeenCalledWith(1);
        expect(Evento.deletar).toHaveBeenCalledWith(1);
        expect(res.redirect).toHaveBeenCalledWith('/home');
    });

    test('Deve retornar 403 se o usuário não tiver permissão para excluir o evento', async () => {
        const eventoMock = { id: 1, id_criador: 3 }; // Criador diferente do usuário logado

        // Mock do comportamento do modelo
        Evento.procurarPorId.mockResolvedValue(eventoMock);

        await excluirEvento(req, res);

        expect(Evento.procurarPorId).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith('Você não tem permissão para excluir este evento');
    });

    test('Deve renderizar a home com erro_exclusao em caso de exceção', async () => {
        const erroMock = new Error('Erro ao excluir evento');

        // Simula uma exceção ao buscar o evento
        Evento.procurarPorId.mockRejectedValue(erroMock);

        await excluirEvento(req, res);

        expect(Evento.procurarPorId).toHaveBeenCalledWith(1);
        expect(res.render).toHaveBeenCalledWith('home.html', { erro_exclusao: true });
    });
});
