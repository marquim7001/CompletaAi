const { exibirLogin } = require('../../src/controllers/autenticacaoController.js');

describe('exibirLogin', () => {
    let req, res;

    beforeEach(() => {
        // Mock do objeto req
        req = {
            session: {},
        };

        // Mock do objeto res
        res = {
            redirect: jest.fn(),
            render: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve redirecionar para /home se o usuário já estiver logado', () => {
        req.session.usuario = { id: 1, email: 'usuario@gmail.com' }; // Simula usuário logado

        exibirLogin(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/home');
        expect(res.render).not.toHaveBeenCalled();
    });

    test('Deve renderizar a página de login se o usuário não estiver logado', () => {
        req.session.usuario = null; // Simula usuário não logado

        exibirLogin(req, res);

        expect(res.render).toHaveBeenCalledWith('login.html');
        expect(res.redirect).not.toHaveBeenCalled();
    });
});
