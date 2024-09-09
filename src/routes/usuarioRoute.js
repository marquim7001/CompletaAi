const express = require('express');
const router = express.Router();

const usuarioController = require('../controller/usuarioController');

router.post('/cadastro', usuarioController.cadastrarUsuario);
router.get('/api/usuarios', usuarioController.listarUsuarios);
router.post('/src/views/configuracao.html', usuarioController.editarUsuario);

module.exports = router;