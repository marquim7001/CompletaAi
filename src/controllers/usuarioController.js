const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

// Criar usuario
const criarUsuario = async (req, res) => {
    try {
        // Receber os dados do corpo da requisição
        const { email, senha, nome, 'data-nascimento': data_nascimento, } = req.body;

        // Encriptar a senha antes de armazenar no banco de dados
        const saltRounds = 10;
        console.log('senha no usuarioController', senha);
        const senhaHash = await bcryptjs.hash(senha, saltRounds);

        // Criar objeto de usuário com a senha encriptada
        const usuarioData = { email, senha: senhaHash, nome, data_nascimento, telefone: null };

        // Chamar a função para inserir no banco de dados
        await Usuario.criar(usuarioData);

        // Redirecionar para a página inicial do usuário após sucesso
        res.redirect('/login');
    } catch (erro) {
        console.error('Erro ao criar usuário:', erro);
        res.render('cadastro.html', { erro_cadastro: true });
    }
};

const editarDadosPessoais = async (req, res) => {
    const id = req.params.id;
    let { nome, 'data-nascimento': data_nascimento, telefone } = req.body;
    try {
        if (!data_nascimento) {
            data_nascimento = null;
        }
        if (!telefone) {
            telefone = null;
        }

        const usuarioData = { nome, data_nascimento, telefone };
        await Usuario.editarDadosPessoais(id, usuarioData);
        res.redirect('/home');
    } catch (erro) {
        console.error('Erro ao editar dados pessoais:', erro);
        res.render('perfil_usuario.html', { erro_edicao: true });
    }
}

const editarDadosSeguranca = async (req, res) => {
    const id = req.params.id;
    const { email, senha } = req.body;
    console.log('dados segurança:', req.body);

    try {
        let senhaHash = null;
        if (senha) {
            senhaHash = await bcryptjs.hash(senha, 10);
        } else if (senha === '') {
            senhaHash = null;
        }
        const usuarioData = {
            ...(email && { email }),
            ...(senhaHash !== null && { senha: senhaHash })
        };
        console.log('usuarioData:', usuarioData);
        if (Object.keys(usuarioData).length > 0) {
            await Usuario.editarDadosSeguranca(id, usuarioData);
        }
        res.redirect('/home');
    } catch (erro) {
        console.error('Erro ao editar dados de segurança:', erro);
        res.render('seguranca_acesso.html', { erro_edicao: true });
    }
};

// Remover evento
const excluirUsuario = async (req, res) => {
    try {
        await Usuario.deletar(req.params.id);
        res.redirect('/home');
    } catch (erro) {
        res.render('home.html', { erro_exclusao: true });
    }
};

// Encontrar usuario por ID
const encontrarUsuario = async (id) => {
    try {
        const usuario = await Usuario.procurarPorId(id);
        if (usuario) {
            return usuario;
        } else {
            return null;
        }
    } catch (erro) {
        console.error('Erro ao encontrar usuário:', erro);
        throw erro;
    }
};

// Adicionario usuario a um evento (usuario se inscreve no evento)
const adicionarUsuarioAoEvento = async (req, res) => {
    const id_evento = req.body['id-evento'];
    const id_usuario = req.session.usuario.id;
    console.log('req.body:', req.body);
    console.log('req.session.usuario.id:', req.session.usuario.id);
    console.log('Adicionando usuário ao evento:', id_usuario, id_evento);

    try {
        await Usuario.adicionarUsuarioAoEvento(id_usuario, id_evento);
        res.redirect('/home');
    } catch (erro) {
        console.error('Erro ao adicionar usuário ao evento:', erro);
        res.render('home.html', { erro_adicao: true });
    }
};

const removerUsuarioDoEvento = async (req, res) => {
    const idUsuario = req.session.usuario.id;
    const idEvento = req.body['id-evento'];
    console.log('req.body:', req.body);
    console.log('req.session.usuario.id:', req.session.usuario.id);
    console.log('Removendo usuário do evento:', idUsuario, idEvento);

    try {
        await Usuario.removerUsuarioDoEvento(idUsuario, idEvento);
        res.redirect('/home');
    } catch (erro) {
        console.error('Erro ao remover usuário do evento:', erro);
        res.render('home.html', { erro_remocao: true });
    }
}

// Listar todos os eventos
const listarUsuarios = async (req, res) => {
    try {
        const resultado = await Usuario.procurarTodos();
        res.render('home_usuario.html', { usuarios: resultado });
    } catch (erro) {
        console.error('Erro ao listar eventos:', erro);
        res.render('erro.html', { erro_listagem: true });
    }
};

const listarIdsUsuariosPorIdEvento = async (idEvento) => {
    try {
        const idsUsuarios = await Usuario.listarIdsUsuariosPorIdEvento(idEvento);
        return idsUsuarios;
    } catch (erro) {
        console.error('Erro ao listar usuários por evento:', erro);
    }
}

const exibirCriarUsuario = (req, res) => {
    console.log('Exibindo página de cadastro');
    res.render('cadastro.html');
};

const exibirPerfilUsuario = async (req, res) => {
    const { usuarioId } = res.locals;
    try {
        const usuario = await Usuario.procurarPorId(usuarioId);
        usuario.data_nascimento = formatarData(usuario.data_nascimento);
        if (usuario) {
            res.render('perfil_usuario.html', {
                usuario,
                usuarioLogado: !!usuarioId,
                usuarioId
            });
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (erro) {
        console.error('Erro ao exibir perfil do usuario:', erro);
        res.status(500).send('Erro interno do servidor');
    }
};

const exibirSegurancaAcessoUsuario = async (req, res) => {
    const { usuarioId } = res.locals;
    try {
        const usuario = await Usuario.procurarPorId(usuarioId);
        if (usuario) {
            res.render('seguranca_acesso.html', {
                usuario,
                usuarioLogado: !!usuarioId,
                usuarioId
            });
        } else {
            res.redirect('/home');
        }
    } catch (erro) {
        console.error('Erro ao exibir a página de segurança e acesso:', erro);
        // res.redirect('/home');
    }
};

const verificarUsuarioInscrito = async (idUsuario, idEvento) => {
    console.log('idUsuarionocontroleler:', idUsuario);
    console.log('idEventonocontroler:', idEvento);
    const isUsuarioInscrito = await Usuario.verificarUsuarioInscrito(idUsuario, idEvento);
    console.log('isUsuarioInscrito:', isUsuarioInscrito);
    return isUsuarioInscrito;
}

const formatarData = (data) => {
    if (data instanceof Date) {
        return data.toISOString().split('T')[0];
    }
    return data;
};

module.exports = {
    criarUsuario,
    editarDadosPessoais,
    editarDadosSeguranca,
    encontrarUsuario,
    excluirUsuario,
    listarUsuarios,
    listarIdsUsuariosPorIdEvento,
    exibirCriarUsuario,
    exibirPerfilUsuario,
    exibirSegurancaAcessoUsuario,
    adicionarUsuarioAoEvento,
    removerUsuarioDoEvento,
    verificarUsuarioInscrito
};