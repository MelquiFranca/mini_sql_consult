const DataBase = require('../classes/Database')
const path = require('path')
const { DataTypes } = require('sequelize')

class DataBaseService {
    static basesConectadas
    static removeDataBase(database, id) {

    }
    static salvarDataBase({ db }) {
        
    }
    static criarDataBaseLocal() {
        const { db } = new DataBase({name: '', host: path.join('database.sqlite'), create: true})
console.log(db)
        const queryInterface = db.getQueryInterface()
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
            // client: DataTypes.STRING,
            password: DataTypes.STRING
        })        
    }
    static async getNomeDataBasesConfiguradas({ db }) {
        const result = await db.query(`SELECT * FROM Bases;`)
        return result[0]
    }
    static async getConsulta({ db }, sql) {    
        const result = await db.query(sql)
        return result[0]
    }
    static async criaDatabasesConfiguradas(dadosBases) {
        const bases = dadosBases.map(base => new DataBase({ ...base }))
        return bases
    }
}
// const result = await db.query(`SELECT name FROM sqlite_master WHERE type='table';`)

module.exports = DataBaseService