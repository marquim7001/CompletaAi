const Evento = require('../models/evento');
const Usuario = require('../models/usuario');

// Criar evento
const criarEvento = async (req, res) => {
  try {
    const { nome, categoria, 'num-vagas': num_vagas, descricao, 'data-inicio': data_inicio, 'data-fim': data_fim, localizacao, 'hora-inicio': hora_inicio, 'hora-fim': hora_fim } = req.body;
    const id_criador = req.session.usuario.id;

    const eventoData = { nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim };
    await Evento.criar(eventoData);

    res.redirect('/home');
  } catch (erro) {
    console.error('Erro ao criar evento:', erro);
    res.render('criar_evento.html', { erro_cadastro: true });
  }
};

const editarEvento = async (req, res) => {
  try {
    const id = req.params.id;
    const id_criador = req.session.usuario.id;
    const { nome, categoria, 'num-vagas': num_vagas, descricao, 'data-inicio': data_inicio, 'data-fim': data_fim, localizacao, 'hora-inicio': hora_inicio, 'hora-fim': hora_fim } = req.body;

    const eventoData = { nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador, localizacao, hora_inicio, hora_fim };
    await Evento.editar(id, eventoData);
    res.redirect('/home');
  } catch (erro) {
    console.error('Erro ao editar evento:', erro);
    res.render('editar_evento.html', { erro_edicao: true, evento: req.body });
  }
};

// Encontrar evento por ID
const encontrarEvento = async (req, res) => {
  try {
    const evento = await Evento.procurarPorId(req.params.id);
    evento.criador = await Usuario.procurarPorId(evento.id_criador);
    console.log('Evento:', evento);
    if (evento) {
      res.render('detalhesEvento.html', { evento });
    } else {
      res.render('detalhesEvento.html', { erro_nao_encontrado: true });
    }
  } catch (erro) {
    res.render('detalhesEvento.html', { erro_busca: true });
  }
};

// Excluir evento
const excluirEvento = async (req, res) => {
  try {
    const evento = await Evento.procurarPorId(req.params.id);
    if (evento.criador === req.session.usuario.id) {
      await Evento.deletar(req.params.id);
      res.redirect('/home');
    } else {
      res.status(403).send('Você não tem permissão para excluir este evento');
    }
  } catch (erro) {
    console.error('Erro ao excluir evento:', erro);
    res.render('home.html', { erro_exclusao: true });
  }
};

// Listar todos os eventos
const listarEventos = async () => {
  try {
    const eventos = await Evento.procurarTodos();
    const eventosFormatados = await Promise.all(eventos.map(async (evento) => {
      evento.data_inicio = formatarData(evento.data_inicio);
      evento.data_fim = formatarData(evento.data_fim);
      const usuario = await Usuario.procurarPorId(evento.id_criador);
      evento.criador = usuario ? usuario.nome : null;
      return evento;
    }));
    return eventosFormatados;
  } catch (erro) {
    console.error('Erro ao listar eventos:', erro);
    throw erro;
  }
};

const listarEventosPorCriador = async (idUsuario) => {
  try {
    const eventosDoCriador = await Evento.procurarPorIdCriador(idUsuario);
    const eventosFormatados = await Promise.all(eventosDoCriador.map(async (evento) => {
      evento.data_inicio = formatarData(evento.data_inicio);
      evento.data_fim = formatarData(evento.data_fim);
      const usuario = await Usuario.procurarPorId(evento.id_criador);
      evento.criador = usuario ? usuario.nome : null;
      return evento;
    }));
    return eventosFormatados;
  } catch (erro) {
    console.error('Erro ao listar eventos por criador:', erro);
  }
}

const listarEventosInscritos = async (idUsuario) => {
  console.log('ID do usuário:', idUsuario);
  try {
    const idsEventos = await listarIdsEventosPorIdUsuario(idUsuario);
    console.log('IDs dos eventos inscritos:', idsEventos);

    if (idsEventos.length === 0) {
      return [];
    }

    const eventosInscritos = await Promise.all(idsEventos.map(async (evento) => {
      const detalhesEvento = await Evento.procurarPorId(evento.id_evento);
      detalhesEvento.data_inicio = formatarData(detalhesEvento.data_inicio);
      detalhesEvento.data_fim = formatarData(detalhesEvento.data_fim);
      const usuario = await Usuario.procurarPorId(detalhesEvento.id_criador);
      detalhesEvento.criador = usuario ? usuario.nome : null;
      return detalhesEvento;
    }));

    return eventosInscritos;
  } catch (erro) {
    console.error('Erro ao listar eventos inscritos:', erro);
    return [];
  }
};

const listarIdsEventosPorIdUsuario = async (idUsuario) => {
  try {
    const idsEventos = await Evento.listarIdsEventosPorIdUsuario(idUsuario);
    console.log('idsEventos no listarIdsEventosPorIdUsuario:', idsEventos);
    return idsEventos;
  } catch (erro) {
    console.error('Erro ao listar eventos por usuário:', erro);
  }
}

const exibirCriarEvento = (req, res) => {
  res.render('criar_evento.html');
};

const exibirDetalhesEvento = async (req, res) => {
  const id_evento = req.params.id;
  const id_usuario = req.session.usuario.id;

  try {
    const evento = await Evento.procurarPorId(id_evento);
    evento.data_inicio = formatarData(evento.data_inicio);
    evento.data_fim = formatarData(evento.data_fim);
    const usuario = await Usuario.procurarPorId(evento.id_criador);
    evento.criador = usuario ? usuario.nome : null;
    if (evento) {
      const isEventoCriador = evento.id_criador == id_usuario;
      const isUsuarioInscrito = await Usuario.verificarUsuarioInscrito(id_usuario, id_evento);
      res.render('detalhes_evento.html', { evento, isEventoCriador, isUsuarioInscrito });
    } else {
      res.status(404).send('Evento não encontrado');
    }
  } catch (erro) {
    console.error('Erro ao exibir detalhes do evento:', erro);
    res.status(500).send('Erro interno do servidor');
  }
};

const exibirEditarEvento = async (req, res) => {
  const id = req.params.id;
  try {
    const evento = await Evento.procurarPorId(id);
    evento.data_inicio = formatarData(evento.data_inicio);
    evento.data_fim = formatarData(evento.data_fim);
    if (evento) {
      res.render('editar_evento.html', { evento });
    } else {
      res.redirect('/home');
    }
  } catch (erro) {
    console.error('Erro ao exibir a página de edição:', erro);
    // res.redirect('/home');
  }
};

// Função para formatar a data no formato YYYY-MM-DD para exibir
const formatarData = (data) => {
  if (data instanceof Date) {
    return data.toISOString().split('T')[0];
  }
  return data;
};

module.exports = {
  criarEvento,
  editarEvento,
  listarEventos,
  listarEventosPorCriador,
  listarEventosInscritos,
  listarIdsEventosPorIdUsuario,
  encontrarEvento,
  excluirEvento,
  exibirCriarEvento,
  exibirDetalhesEvento,
  exibirEditarEvento
};