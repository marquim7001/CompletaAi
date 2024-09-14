const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

//GET
router.get('/home_usuario', usuarioController.listarUsuarios);
router.get('/cadastro', usuarioController.exibirCriarUsuario);
router.get('/perfil_usuario/:id', usuarioController.exibirDetalhesUsuario);
router.get('/editar_usuario/:id', usuarioController.exibirEditarUsuario);
// router.get('/criar_evento', eventoController.exibirCriarEvento);
// router.get('/home', eventoController.listarEventos);
// router.get('/inscricao_evento', eventoController.);
// router.get('/login', eventoController.);

//POST
router.post('/cadastro', usuarioController.criarUsuario);
router.post('/editar_usuario/:id', usuarioController.editarUsuario);
router.post('/excluir_usuario/:id', usuarioController.excluirUsuario);
// router.post('/criar_evento', eventoController.criarEvento);

module.exports = router;