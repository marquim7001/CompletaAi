const Evento = require('../models/evento');

// Criar evento
const criarEvento = async (req, res) => {
  try {
    // console.log(`req.body: ${JSON.stringify(req.body)}`);  // Exibe o corpo da requisição
    const { nome, categoria, 'num-vagas': num_vagas, descricao, 'data-inicio': data_inicio, 'data-fim': data_fim } = req.body;

    const eventoData = { nome, categoria, num_vagas, descricao, data_inicio, data_fim };
    // console.log(`eventoData: ${JSON.stringify(eventoData)}`);  // Exibe os dados do evento

    await Evento.criar(eventoData);  // Chama a função para inserir no banco de dados

    res.redirect('/home');  // Redireciona para a página de eventos após o sucesso
  } catch (erro) {
    console.error('Erro ao criar evento:', erro);
    res.render('criar_evento.html', { erro_cadastro: true });
  }
};

const editarEvento = async (req, res) => {
  const id = req.params.id;
  const { nome, categoria, 'num-vagas': num_vagas, descricao, 'data-inicio': data_inicio, 'data-fim': data_fim } = req.body;
  const eventoData = { nome, categoria, num_vagas, descricao, data_inicio, data_fim };
  try {
    // Atualizar evento no banco de dados
    await Evento.editar(id, eventoData);
    res.redirect('/home');  // Redirecionar após a atualização
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

// Remover evento
const excluirEvento = async (req, res) => {
  try {
    await Evento.deletar(req.params.id);
    res.redirect('/home');  // Redireciona após a exclusão
  } catch (erro) {
    res.render('listarEventos.html', { erro_exclusao: true });
  }
};

const listarEventos = async (req, res) => {
  try {
    const resultado = await Evento.procurarTodos();  // Aguarda a lista de eventos
    res.render('home.html', { eventos: resultado });
  } catch (erro) {
    console.error('Erro ao listar eventos:', erro);
    res.render('home.html', { erro_listagem: true });
  }
};

const exibirCriarEvento = (req, res) => {
  res.render('criar_evento.html');
};

const exibirDetalhesEvento = async (req, res) => {
  const { id } = req.params;
  try {
    const evento = await Evento.procurarPorId(id);  // Busca o evento pelo ID
    if (evento) {
      res.render('detalhes_evento.html', { evento });  // Renderiza a página com os detalhes do evento
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
      res.redirect('/home');  // Redireciona se o evento não for encontrado
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
  encontrarEvento,
  excluirEvento,
  exibirCriarEvento,
  exibirDetalhesEvento,
  exibirEditarEvento
};