const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const autenticacaoController = require('../controllers/autenticacaoController');

// Protege as rotas com autenticação
//GET
router.get('/home', autenticacaoController.exibirHome);
router.get('/criar_evento', eventoController.exibirCriarEvento);
router.get('/detalhes_evento/:id', eventoController.exibirDetalhesEvento);
router.get('/editar_evento/:id', eventoController.exibirEditarEvento);
// router.get('/inscricao_evento', eventoController.);
// router.get('/login', eventoController.);

//POST
router.post('/criar_evento', eventoController.criarEvento);
router.post('/excluir_evento/:id', eventoController.excluirEvento);
router.post('/editar_evento/:id', eventoController.editarEvento);

module.exports = router;