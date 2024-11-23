const { fazerLogout } = require('../../src/controllers/autenticacaoController.js');

describe('fazerLogout', () => {
    let req, res;

    beforeEach(() => {
        // Mock do objeto req
        req = {
            session: {
                destroy: jest.fn(),
            },
        };

        // Mock do objeto res
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            redirect: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve finalizar a sessão e redirecionar para /home com sucesso', () => {
        req.session.destroy.mockImplementation((callback) => callback(null));

        fazerLogout(req, res);

        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/home');
    });

    test('Deve retornar erro 500 se houver falha ao destruir a sessão', () => {
        const erroMock = new Error('Erro ao destruir a sessão');
        req.session.destroy.mockImplementation((callback) => callback(erroMock));

        fazerLogout(req, res);

        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Erro ao fazer logout');
    });
});
