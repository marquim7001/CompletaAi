const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

//GET
router.get('/criar_evento', eventoController.exibirCriarEvento);
router.get('/detalhes_evento/:id', eventoController.exibirDetalhesEvento);
router.get('/editar_evento/:id', eventoController.exibirEditarEvento);

//POST
router.post('/criar_evento', eventoController.criarEvento);
router.post('/excluir_evento/:id', eventoController.excluirEvento);
router.post('/editar_evento/:id', eventoController.editarEvento);

module.exports = router;