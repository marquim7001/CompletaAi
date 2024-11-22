const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const carregarDadosCompartilhados = require('../middlewares/dadosCompartilhados');

//GET
router.get('/criar_evento', carregarDadosCompartilhados, eventoController.exibirCriarEvento);
router.get('/detalhes_evento/:id', carregarDadosCompartilhados, eventoController.exibirDetalhesEvento);
router.get('/editar_evento/:id', carregarDadosCompartilhados, eventoController.exibirEditarEvento);
router.get('/eventos', carregarDadosCompartilhados, eventoController.exibirPaginaEventos);

//POST
router.post('/criar_evento', eventoController.criarEvento);
router.post('/excluir_evento/:id', eventoController.excluirEvento);
router.post('/editar_evento/:id', eventoController.editarEvento);

module.exports = router;