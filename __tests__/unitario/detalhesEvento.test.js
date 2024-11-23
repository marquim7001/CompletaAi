const { exibirDetalhesEvento } = require('../../scr/controllers/eventoController');
const Evento = require('../../src/models/evento');
const Usuario = require('../../src/models/usuario');

jest.mock('../../src/models/evento');
jest.mock('../../src/models/usuario');

describe('exibirDetalhesEvento', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: '1' },
      session: { usuario: { id: 2 } }
    };
    res = {
      locals: { usuarioId: 2 },
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  test('Deve renderizar a página de detalhes do evento com os dados corretos', async () => {
    const eventoMock = {
      id: 1,
      nome: 'Evento Teste',
      id_criador: 2,
      data_inicio: '2024-01-01',
      data_fim: '2024-01-02'
    };
    const usuarioMock = { id: 2, nome: 'Criador do Evento' };

    Evento.procurarPorId.mockResolvedValue(eventoMock);
    Usuario.procurarPorId.mockResolvedValue(usuarioMock);
    Usuario.verificarUsuarioInscrito.mockResolvedValue(true);

    // Simulando uma formatação direta no código
    const formatarData = (data) => `Formatado(${data})`;
    eventoMock.data_inicio = formatarData(eventoMock.data_inicio);
    eventoMock.data_fim = formatarData(eventoMock.data_fim);

    await exibirDetalhesEvento(req, res);

    expect(Evento.procurarPorId).toHaveBeenCalledWith('1');
    expect(Usuario.procurarPorId).toHaveBeenCalledWith(2);
    expect(Usuario.verificarUsuarioInscrito).toHaveBeenCalledWith(2, '1');
    expect(res.render).toHaveBeenCalledWith('detalhes_evento.html', {
      usuarioLogado: true,
      usuarioId: 2,
      evento: {
        ...eventoMock,
        criador: 'Criador do Evento'
      },
      isEventoCriador: true,
      isUsuarioInscrito: true
    });
  });

  test('Deve retornar 404 se o evento não for encontrado', async () => {
    Evento.procurarPorId.mockResolvedValue(null);

    await exibirDetalhesEvento(req, res);

    expect(Evento.procurarPorId).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Evento não encontrado');
  });

  test('Deve retornar 500 em caso de erro interno', async () => {
    Evento.procurarPorId.mockRejectedValue(new Error('Erro ao buscar evento'));

    await exibirDetalhesEvento(req, res);

    expect(Evento.procurarPorId).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Erro interno do servidor');
  });
});
