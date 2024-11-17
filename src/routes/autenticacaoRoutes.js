const express = require('express');
const router = express.Router();
const autenticacaoController = require('../controllers/autenticacaoController');
const carregarDadosCompartilhados = require('../middlewares/dadosCompartilhados');

// GET
router.get('/home', carregarDadosCompartilhados, autenticacaoController.exibirHome);
router.get('/sobre', carregarDadosCompartilhados, autenticacaoController.exibirSobre);
router.get('/login', carregarDadosCompartilhados, autenticacaoController.exibirLogin);
router.get('/logout', carregarDadosCompartilhados, autenticacaoController.fazerLogout);

// POST
router.post('/login', autenticacaoController.fazerLogin);

module.exports = router;