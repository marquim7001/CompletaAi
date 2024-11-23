const { criarEvento } = require('../../src/controllers/eventoController.js');
const Evento = require('../../src/models/evento.js');

// Mock do modelo Evento
jest.mock('../../src/models/evento.js');

describe('criarEvento', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                nome: 'Evento Teste',
                categoria: 'Categoria Teste',
                'num-vagas': 100,
                descricao: 'Descrição do evento teste',
                'data-inicio': '2024-12-01',
                'data-fim': '2024-12-02',
                localizacao: 'Local Teste',
                'hora-inicio': '08:00',
                'hora-fim': '18:00',
            },
            session: {
                usuario: { id: 1 }, 
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

    test('Deve criar um evento com sucesso e redirecionar para /home', async () => {
        Evento.criar.mockResolvedValue();

        await criarEvento(req, res);

        const eventoData = {
            nome: 'Evento Teste',
            categoria: 'Categoria Teste',
            num_vagas: 100,
            descricao: 'Descrição do evento teste',
            data_inicio: '2024-12-01',
            data_fim: '2024-12-02',
            id_criador: 1,
            localizacao: 'Local Teste',
            hora_inicio: '08:00',
            hora_fim: '18:00',
        };

        expect(Evento.criar).toHaveBeenCalledWith(eventoData);
        expect(res.redirect).toHaveBeenCalledWith('/home');
    });

    test('Deve renderizar a página de criação com erro_cadastro em caso de exceção', async () => {
        const erroMock = new Error('Erro ao criar evento');
        Evento.criar.mockRejectedValue(erroMock);

        await criarEvento(req, res);

        expect(Evento.criar).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('criar_evento.html', { erro_cadastro: true });
    });
});
