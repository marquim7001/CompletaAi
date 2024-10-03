const bcrypt = require('bcrypt');  // Adicionar bcrypt para encriptação de senhas
const Usuario = require('../models/usuario');

// Criar usuario
const criarUsuario = async (req, res) => {
    try {
        // Receber os dados do corpo da requisição
        const { email, senha, nome, 'data-nascimento': data_nascimento } = req.body;

        // Encriptar a senha antes de armazenar no banco de dados
        const saltRounds = 10;  // Número de rounds para o salt (quanto maior, mais seguro e mais lento)
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        // Criar objeto de usuário com a senha encriptada
        const usuarioData = { email, senha: senhaHash, nome, data_nascimento };

        // Chamar a função para inserir no banco de dados
        await Usuario.criar(usuarioData);

        // Redirecionar para a página inicial do usuário após sucesso
        res.redirect('/home_usuario');
    } catch (erro) {
        console.error('Erro ao criar usuário:', erro);
        res.render('cadastro.html', { erro_cadastro: true });
    }
};

// Editar usuário
const editarUsuario = async (req, res) => {
    const id = req.params.id;
    const { email, senha, nome, 'data-nascimento': data_nascimento } = req.body;

    try {
        let senhaHash;

        // Se uma nova senha foi fornecida, encriptar a nova senha
        if (senha) {
            const saltRounds = 10;
            senhaHash = await bcrypt.hash(senha, saltRounds);
        }

        // Criar objeto de usuário, incluindo a nova senha (caso fornecida)
        const usuarioData = {
            email,
            nome,
            data_nascimento,
            ...(senhaHash && { senha: senhaHash })  // Adiciona a senha encriptada somente se foi fornecida
        };

        // Atualizar usuário no banco de dados
        await Usuario.editar(id, usuarioData);
        res.redirect('/home_usuario');  // Redirecionar após a atualização
    } catch (erro) {
        console.error('Erro ao editar usuário:', erro);
        res.render('cadastro.html', { erro_edicao: true, usuario: req.body });
    }
};

// Remover evento
const excluirUsuario = async (req, res) => {
    try {
        await Usuario.deletar(req.params.id);
        res.redirect('/home_usuario');  // Redireciona após a exclusão
    } catch (erro) {
        res.render('home.html', { erro_exclusao: true });
    }
};

// Encontrar usuario por ID
const encontrarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (usuario) {
            res.render('detalhes_usuario.html', { usuario });
        } else {
            res.render('detalhes_usuario.html', { erro_nao_encontrado: true });
        }
    } catch (erro) {
        res.render('detalhes_usuario.html', { erro_busca: true });
    }
};

// Listar todos os eventos
const listarUsuarios = async (req, res) => {
    try {
        const resultado = await Usuario.procurarTodos();  // Aguarda a lista de usuariosz
        res.render('home_usuario.html', { usuarios: resultado });
    } catch (erro) {
        console.error('Erro ao listar eventos:', erro);
        res.render('erro.html', { erro_listagem: true });
    }
};

const exibirCriarUsuario = (req, res) => {
    console.log('Exibindo página de cadastro');
    res.render('cadastro.html');
};

const exibirDetalhesUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.procurarPorId(id);  // Busca o usuario pelo ID
        if (usuario) {
            res.render('perfil_usuario.html', { usuario });  // Renderiza a página com os detalhes do usuario
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (erro) {
        console.error('Erro ao exibir detalhes do usuario:', erro);
        res.status(500).send('Erro interno do servidor');
    }
};

const exibirEditarUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await Usuario.procurarPorId(id);
        if (usuario) {
            res.render('editar_usuario.html', { usuario });
        } else {
            res.redirect('/home');  // Redireciona se o usuario não for encontrado
        }
    } catch (erro) {
        console.error('Erro ao exibir a página de edição:', erro);
        // res.redirect('/home');
    }
};

module.exports = {
    criarUsuario,
    editarUsuario,
    encontrarUsuario,
    excluirUsuario,
    listarUsuarios,
    exibirCriarUsuario,
    exibirDetalhesUsuario,
    exibirEditarUsuario
};