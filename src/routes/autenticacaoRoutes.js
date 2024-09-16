const express = require('express');
const router = express.Router();
const autenticacaoController = require('../controllers/autenticacaoController');
const { verificarAutenticacao } = require('../middlewares/authMiddleware');

// GET
router.get('/login', autenticacaoController.exibirLogin);

// POST
router.post('/login', autenticacaoController.fazerLogin);
router.post('/logout', autenticacaoController.fazerLogout);

// Rotas protegidas usando o middleware de verificação de autenticação
router.get('/home', verificarAutenticacao, (req, res) => {
    // Exemplo: renderizar uma página protegida após o login
    res.render('home.html', { usuario: req.session.usuario });
});

module.exports = router;
