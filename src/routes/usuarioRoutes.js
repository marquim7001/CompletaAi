const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

//GET
router.get('/home_usuario', usuarioController.listarUsuarios);
router.get('/cadastro', usuarioController.exibirCriarUsuario);
router.get('/perfil_usuario/:id', usuarioController.exibirDetalhesUsuario);
router.get('/editar_usuario/:id', usuarioController.exibirEditarUsuario);

//POST
router.post('/cadastro', usuarioController.criarUsuario);
router.post('/editar_usuario/:id', usuarioController.editarUsuario);
router.post('/excluir_usuario/:id', usuarioController.excluirUsuario);


//TEMP
router.get('/login', (req, res) => {
    res.render('login.html');
});

module.exports = router;