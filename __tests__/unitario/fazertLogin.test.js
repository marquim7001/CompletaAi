// Importações necessárias
const { fazerLogin } = require('../../src/controllers/autenticacaoController.js');
const Autenticacao = require('../../src/models/autenticacao.js');

// Mock do módulo de autenticação
jest.mock('../../src/models/autenticacao');

describe('fazerLogin', () => {
    let req, res;

    beforeEach(() => {
        // Mock do objeto req
        req = {
            body: {
                email: 'usuario@gmail.com',
                senha: 'senha123',
            },
            session: {},
        };

        // Mock do objeto res
        res = {
            status: jest.fn().mockReturnThis(),
            render: jest.fn(),
            redirect: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve realizar o login com sucesso e redirecionar para /home', async () => {
        // Mock do usuário autenticado
        const usuarioMock = { id: 1, email: 'usuario@gmail.com', nome: 'Usuário Teste' };
        Autenticacao.autenticar.mockResolvedValue(usuarioMock);

        await fazerLogin(req, res);

        expect(Autenticacao.autenticar).toHaveBeenCalledWith(req.body.email, req.body.senha);
        expect(req.session.usuario).toEqual({ id: 1, email: 'usuario@gmail.com', nome: 'Usuário Teste' });
        expect(res.redirect).toHaveBeenCalledWith('/home');
    });

    test('Deve retornar erro de autenticação quando o login falhar', async () => {
        // Mock para falha de autenticação
        Autenticacao.autenticar.mockResolvedValue(null);

        await fazerLogin(req, res);

        expect(Autenticacao.autenticar).toHaveBeenCalledWith(req.body.email, req.body.senha);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.render).toHaveBeenCalledWith('login.html', { erro_login: true });
    });

    test('Deve lidar com erro interno ao tentar autenticar', async () => {
        // Mock para erro na autenticação
        const erroMock = new Error('Erro interno');
        Autenticacao.autenticar.mockRejectedValue(erroMock);

        await fazerLogin(req, res);

        expect(Autenticacao.autenticar).toHaveBeenCalledWith(req.body.email, req.body.senha);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Erro ao fazer login');
    });
});
