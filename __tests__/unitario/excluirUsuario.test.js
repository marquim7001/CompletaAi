const { excluirUsuario } = require('../../src/controllers/usuarioController.js');
const Usuario = require('../../src/models/usuario.js');

// Mock do modelo Usuario
jest.mock('../../src/models/usuario');

describe('excluirUsuario', () => {
    let req, res;

    beforeEach(() => {
   
        req = {
            params: {
                id: 1, 
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

    test('Deve excluir o usuário com sucesso e redirecionar para /home', async () => {
        Usuario.deletar.mockResolvedValue();

        await excluirUsuario(req, res);

        expect(Usuario.deletar).toHaveBeenCalledWith(1);
        expect(res.redirect).toHaveBeenCalledWith('/home');
    });

    test('Deve renderizar home com erro_exclusao em caso de exceção', async () => {
        const erroMock = new Error('Erro ao excluir usuário');

        Usuario.deletar.mockRejectedValue(erroMock);

        await excluirUsuario(req, res);

        expect(Usuario.deletar).toHaveBeenCalledWith(1);
        expect(res.render).toHaveBeenCalledWith('home.html', { erro_exclusao: true });
    });
});
