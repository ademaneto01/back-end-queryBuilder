const knex = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;
    const usuario = req.usuario;

    if (!nome) {
        return res.status(404).json("O campo nome é obrigatório");
    }

    if (!email) {
        return res.status(404).json("O campo email é obrigatório");
    }

    if (!senha) {
        return res.status(404).json("O campo senha é obrigatório");
    }

    if (!nome_loja) {
        return res.status(404).json("O campo nome_loja é obrigatório");
    }

    try {
        if (email && email !== usuario.email) {
            const emailExistente = await knex('usuarios').where({ email: email }).first()
            if (emailExistente) {
                return res.status(404).json("E-mail já existente")
            }
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuarioExistente = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada, nome_loja }).first();

        if (!usuarioExistente) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        return res.status(200).json("O usuario foi cadastrado com sucesso!");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const atualizarPerfil = async (req, res) => {
    let { nome, email, senha, nome_loja } = req.body;
    const usuario = req.usuario;

    if (!nome && !email && !senha && !nome_loja) {
        return res.status(404).json('É obrigatório informar ao menos um campo para atualização');
    }

    try {

        if (email && email !== usuario.email) {
            const emailExistente = await knex('usuarios').where({ email: email }).first()
            if (emailExistente) {
                return res.status(404).json("E-mail já existente")
            }
        }
        if (senha) {
            senha = await bcrypt.hash(senha, 10)

        }
        const novoUsuario = {
            nome: nome ? nome : usuario.nome,
            email: email ? email : usuario.email,
            senha: senha ? senha : usuario.senha,
            nome_loja: nome_loja ? nome_loja : usuario.nome_loja,

        }
        const usuarioAtualizado = await knex('usuarios').update(novoUsuario).where({ id: usuario.id }).returning('*');

        return res.status(200).json(usuarioAtualizado);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}