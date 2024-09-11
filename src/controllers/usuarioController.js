const Usuario = require('../models/usuario');

function cadastrarUsuario(req, res) {
    let usuario = {
        email: req.body.email,
        senha: req.body.senha,
        nome: req.body.nome,
        data_nascimento: req.body.data_nascimento,
    }

    Usuario.create(usuario).then(()=>{
        let sucesso = true;
        res.render("index.html", {sucesso});
    }).catch((err)=>{
        console.log(err);
        let erro = true;
        res.render("index.html", {erro});
    });

}

function listarUsuarios(req, res) {
    Usuario.findAll().then((usuarios)=>{
        res.json(usuarios);
    }).catch((err)=>{
        res.json(err);
    });
}

function editarUsuario(req, res) {
    let usuario = {
        email: req.body.email,
        senha: req.body.senha,
        nome: req.body.nome,
        data_nascimento: req.body.data_nascimento,
    }
    Usuario.update(
      usuario,
      {
        where: {
          id: req.body.id,
        },
      }
    ).then(function (sucesso) {
        console.log(JSON.stringify(usuario));
        res.json({ mensagem: "Usuário atualizado com sucesso!" });
    })
    .catch(function (erro) {
        res.json({ mensagem: `Erro ao atualizar o usuário. ${erro}` });
    });

}



module.exports = {
    cadastrarUsuario,
    listarUsuarios,
    editarUsuario
}