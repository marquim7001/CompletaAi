const Evento = require('../models/evento');

// Criar evento
const criarEvento = async (req, res) => {
  try {
    const { nome, categoria, 'num-vagas': num_vagas, descricao, 'data-inicio': data_inicio, 'data-fim': data_fim } = req.body;
    const id_criador = req.session.usuario.id;

    const eventoData = { nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador };
    await Evento.criar(eventoData);

    res.redirect('/home');
  } catch (erro) {
    console.error('Erro ao criar evento:', erro);
    res.render('criar_evento.html', { erro_cadastro: true });
  }
};

const editarEvento = async (req, res) => {
  const id = req.params.id;
  const { nome, categoria, 'num-vagas': num_vagas, descricao, 'data-inicio': data_inicio, 'data-fim': data_fim, id_criador } = req.body;
  const eventoData = { nome, categoria, num_vagas, descricao, data_inicio, data_fim, id_criador };
  try {
    await Evento.editar(id, eventoData);
    res.redirect('/home');
  } catch (erro) {
    console.error('Erro ao editar evento:', erro);
    res.render('editar_evento.html', { erro_edicao: true, evento: req.body });
  }
};

// Listar todos os eventos

// Encontrar evento por ID
const encontrarEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
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

const listarEventos = async () => {
  try {
    const eventos = await Evento.procurarTodos();
    return eventos;
  } catch (erro) {
    console.error('Erro ao listar eventos:', erro);
    throw erro;
  }
};

const listarEventosPorCriador = async (idUsuario) => {
  try {
    const eventosDoCriador = await Evento.procurarPorIdCriador(idUsuario);
    return eventosDoCriador;
  } catch (erro) {
    console.error('Erro ao listar eventos por criador:', erro);
  }
}

const exibirCriarEvento = (req, res) => {
  res.render('criar_evento.html');
};

const exibirDetalhesEvento = async (req, res) => {
  const { id } = req.params;
  try {
    const evento = await Evento.procurarPorId(id);
    if (evento) {
      const isEventoCriador = evento.id_criador == req.session.usuario.id;
      res.render('detalhes_evento.html', { evento, isEventoCriador });
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

module.exports = {
  criarEvento,
  editarEvento,
  listarEventos,
  listarEventosPorCriador,
  encontrarEvento,
  excluirEvento,
  exibirCriarEvento,
  exibirDetalhesEvento,
  exibirEditarEvento
};