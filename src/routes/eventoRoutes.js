const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const autenticacaoController = require('../controllers/autenticacaoController');

// Protege as rotas com autenticação
router.get('/home', autenticacaoController.verificarAutenticacao, eventController.listarEventos);
router.post('/criar_evento', autenticacaoController.verificarAutenticacao, eventController.criarEvento);
router.post('/remover_evento/:id', autenticacaoController.verificarAutenticacao, eventController.removerEvento);
router.post('/editar_evento/:id', autenticacaoController.verificarAutenticacao, eventController.editarEvento);

module.exports = router;
