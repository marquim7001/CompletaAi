const { editarEvento } = require('../../src/controllers/eventoController.js');
const Evento = require('../../src/models/evento.js');

jest.mock('../../src/models/evento');

describe('editarEvento', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                id: 1,
            },
            session: {
                usuario: { id: 2 }, 
            },
            body: {
                nome: 'Evento Editado',
                categoria: 'Categoria Atualizada',
                'num-vagas': 50,
                descricao: 'Descrição Atualizada',
                'data-inicio': '2024-12-05',
                'data-fim': '2024-12-06',
                localizacao: 'Novo Local',
                'hora-inicio': '09:00',
                'hora-fim': '17:00',
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

    test('Deve editar o evento com sucesso e redirecionar para /home', async () => {
        Evento.editar.mockResolvedValue();

        await editarEvento(req, res);

        const eventoData = {
            nome: 'Evento Editado',
            categoria: 'Categoria Atualizada',
            num_vagas: 50,
            descricao: 'Descrição Atualizada',
            data_inicio: '2024-12-05',
            data_fim: '2024-12-06',
            id_criador: 2,
            localizacao: 'Novo Local',
            hora_inicio: '09:00',
            hora_fim: '17:00',
        };

        expect(Evento.editar).toHaveBeenCalledWith(1, eventoData);
        expect(res.redirect).toHaveBeenCalledWith('/home');
    });

    test('Deve renderizar a página de edição com erro_edicao em caso de exceção', async () => {
        const erroMock = new Error('Erro ao editar evento');
        Evento.editar.mockRejectedValue(erroMock);

        await editarEvento(req, res);

        expect(Evento.editar).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('editar_evento.html', { erro_edicao: true, evento: req.body });
    });
});
