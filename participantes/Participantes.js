const Sequelize = require("sequelize");
const connection = require("../database/database")

const Participantes = connection.define('Participantes',{
    nome:{
        type: Sequelize.STRING,
        allownull: false
    },
    email:{
        type: Sequelize.STRING,
        allownull: false
    }
})

module.exports = Participantes;