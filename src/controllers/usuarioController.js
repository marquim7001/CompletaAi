const Usuario = require('../models/usuario');

// Criar usuario
const criarUsuario = async (req, res) => {
    try {
        // console.log(`req.body: ${JSON.stringify(req.body)}`);  // Exibe o corpo da requisição
        const { email, senha, nome, 'data-nascimento': data_nascimento } = req.body;

        const usuarioData = { email, senha, nome, data_nascimento };
        // console.log(`eventoData: ${JSON.stringify(eventoData)}`);  // Exibe os dados do evento

        await Usuario.criar(usuarioData);  // Chama a função para inserir no banco de dados

        res.redirect('/home_usuario');  // Redireciona para a página de eventos após o sucesso
    } catch (erro) {
        console.error('Erro ao criar usuário:', erro);
        res.render('cadastro.html', { erro_cadastro: true });
    }
};

const editarUsuario = async (req, res) => {
    const id = req.params.id;
    const { email, senha, nome, 'data-nascimento': data_nascimento } = req.body;

    const usuarioData = { email, senha, nome, data_nascimento };
    try {
        // Atualizar evento no banco de dados
        await Usuario.editar(id, usuarioData);
        res.redirect('/home_usuario');  // Redirecionar após a atualização
    } catch (erro) {
        console.error('Erro ao editar evento:', erro);
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