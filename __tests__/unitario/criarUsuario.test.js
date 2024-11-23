const { criarUsuario } = require('../../src/controllers/usuarioController.js');
const Usuario = require('../../src/models/usuario.js');
const bcryptjs = require('bcryptjs');

jest.mock('../../src/models/usuario');
jest.mock('bcryptjs');

describe('criarUsuario', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'usuario@gmail.com',
                senha: 'senha123',
                nome: 'Usuário Teste',
                'data-nascimento': '2000-01-01',
            },
        };

        res = {
            redirect: jest.fn(),
            render: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve criar o usuário com sucesso e redirecionar para /login', async () => {
        const senhaHashMock = 'hash-da-senha';
        
        bcryptjs.hash.mockResolvedValue(senhaHashMock);
        Usuario.criar.mockResolvedValue();

        await criarUsuario(req, res);

        const usuarioData = {
            email: 'usuario@gmail.com',
            senha: senhaHashMock,
            nome: 'Usuário Teste',
            data_nascimento: '2000-01-01',
            telefone: null,
        };

        expect(bcryptjs.hash).toHaveBeenCalledWith('senha123', 10);
        expect(Usuario.criar).toHaveBeenCalledWith(usuarioData);
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    test('Deve renderizar a página de cadastro com erro_cadastro em caso de exceção', async () => {
        const erroMock = new Error('Erro ao criar usuário');

        bcryptjs.hash.mockRejectedValue(erroMock);

        await criarUsuario(req, res);

        expect(bcryptjs.hash).toHaveBeenCalledWith('senha123', 10);
        expect(res.render).toHaveBeenCalledWith('cadastro.html', { erro_cadastro: true });
    });
});
