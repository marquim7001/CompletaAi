const Sequelize = require('sequelize');
const database = require('../db');

const Evento = database.define('evento', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria: {
        type: Sequelize.STRING,
        allowNull: false
    },
    vagas_evento: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao_evento: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_inicio: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_final: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Evento;