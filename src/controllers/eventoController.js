const Event = require('../models/event');

// Exibe todos os eventos do usuário
exports.listarEventos = (req, res) => {
  const id_usuario = req.session.usuario.id;
  Event.getAll({ id_usuario }, (erro, eventos) => {
    if (erro) {
      return res.render('home.html', { erro_recupera_eventos: true });
    }
    res.render('home.html', { eventos });
  });
};

// Cria um novo evento
exports.criarEvento = (req, res) => {
  const { name, date, location } = req.body;
  const id_usuario = req.session.usuario.id;

  Event.create({ name, date, location, id_usuario }, (erro) => {
    if (erro) {
      return res.render('eventForm.html', { erro_cadastro: true });
    }
    res.redirect('/home');
  });
};

// Remove um evento
exports.removerEvento = (req, res) => {
  const { id } = req.params;
  Event.remove(id, (erro) => {
    if (erro) {
      return res.redirect('/home?erro_remocao=true');
    }
    res.redirect('/home');
  });
};

// Atualiza um evento
exports.editarEvento = (req, res) => {
  const { id } = req.params;
  const { name, date, location } = req.body;

  Event.update(id, { name, date, location }, (erro) => {
    if (erro) {
      return res.render('eventForm.html', { erro_edicao: true });
    }
    res.redirect('/home');
  });
};
