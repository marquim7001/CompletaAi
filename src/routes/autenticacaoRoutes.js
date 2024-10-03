const express = require('express');
const router = express.Router();
const autenticacaoController = require('../controllers/autenticacaoController');

// GET
router.get('/login', autenticacaoController.exibirLogin);
router.get('/logout', autenticacaoController.fazerLogout);

// POST
router.post('/login', autenticacaoController.fazerLogin);

module.exports = router;