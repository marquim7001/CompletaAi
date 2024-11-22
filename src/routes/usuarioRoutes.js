const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const carregarDadosCompartilhados = require('../middlewares/dadosCompartilhados');

//GET
router.get('/home_usuario', carregarDadosCompartilhados, usuarioController.listarUsuarios);
router.get('/cadastro', carregarDadosCompartilhados, usuarioController.exibirCriarUsuario);
router.get('/perfil_usuario/:id', carregarDadosCompartilhados, usuarioController.exibirPerfilUsuario);
router.get('/seguranca_acesso/:id', carregarDadosCompartilhados, usuarioController.exibirSegurancaAcessoUsuario);

//POST
router.post('/cadastro', usuarioController.criarUsuario);
router.post('/editar_dados_pessoais/:id', usuarioController.editarDadosPessoais);
router.post('/editar_dados_seguranca/:id', usuarioController.editarDadosSeguranca);
router.post('/excluir_usuario/:id', usuarioController.excluirUsuario);
router.post('/inscrever_no_evento/:id', usuarioController.adicionarUsuarioAoEvento);
router.post('/desinscrever_do_evento/:id', usuarioController.removerUsuarioDoEvento);
//TEMP
// router.get('/login', (req, res) => {
//     res.render('login.html');
// });

module.exports = router;