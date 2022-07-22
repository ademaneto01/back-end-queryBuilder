// const { default: knex } = require('knex');
const knex = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;

    try {

        const produtos = await knex('produtos').where({ id: usuario.id })
        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const usuario = req;
    const { id } = req.params;

    try {
        const produtoEncontrado = await knex(produtos).where({ usuario_id: usuario.id, id }).first();

        if (!produtoEncontrado) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(produtoEncontrado);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }

    if (!estoque) {
        return res.status(404).json('O campo estoque é obrigatório');
    }

    if (!preco) {
        return res.status(404).json('O campo preco é obrigatório');
    }

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    }

    try {

        await knex('produtos').insert({ usuario_id: usuario.id, nome, estoque, preco, categoria, descricao, imagem })
        return res.status(200).json('O produto foi cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    let { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }

    try {

        const encontrarProduto = await knex('produtos').where({ usuario_id: usuario.id, id }).first();
        if (!encontrarProduto) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoAtualizado = {
            nome: nome ? nome : usuario.nome,
            estoque: estoque ? estoque : usuario.estoque,
            preco: preco ? preco : usuario.preco,
            categoria: categoria ? categoria : usuario.categoria,
            descricao: descricao ? descricao : usuario.descricao,
            imagem: imagem ? imagem : usuario.imagem
        }
        const atualizado = await knex('produtos').update(produtoAtualizado).where({ id, usuario_id: usuario.id }).returning('*');

        return res.status(200).json(atualizado);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {

        const encontrarProduto = await knex('produtos').where({ id, usuario_id: usuario.id }).first();
        if (!encontrarProduto) {
            return res.status(404).json('Produto não encontrado');
        }
        const produtoExcluido = await knex('produtos').where({ id }).del().returning('*');
        if (!produtoExcluido) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}