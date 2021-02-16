const DataBase = require('../classes/Database')
const path = require('path')
const { DataTypes } = require('sequelize')

class DataBaseService {
    static #basesConectadas = []
    static removeDataBase = (database, id) => {

    }
    static salvarDataBase = ({ db }) => {
        
    }
    static criarDataBaseLocal = () => {
        const database = new DataBase({name: '', host: path.join('database.sqlite'), create: true})

        const queryInterface = database.db.getQueryInterface()
        queryInterface.createTable('Bases', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: false,
                autoIncrement: true
            },
            name: DataTypes.STRING,
            host: DataTypes.STRING,
            user: DataTypes.STRING,    
            dialect: DataTypes.STRING,
            password: DataTypes.STRING
        })

        return database
    }
    static getDadosDataBasesConfiguradas = async({ db }) => {
        const result = await db.query(`SELECT * FROM Bases;`)
        return result[0]
    }
    static getConsulta = async ({ db }, sql) => {
        const result = await db.query(sql)
        return result[0]
    }

    static get basesConectadas() {
        return this.#basesConectadas
    }
    static set basesConectadas(dadosBases) {
        this.#basesConectadas = dadosBases
    }
    static getBaseId(id) {
        const base = this.#basesConectadas.filter(base => base.id == id)[0]
        console.log(base)
        return new DataBase({ ...base })
    }
}
// const result = await db.query(`SELECT name FROM sqlite_master WHERE type='table';`)

module.exports = DataBaseService