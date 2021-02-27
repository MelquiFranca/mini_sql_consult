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

        try {
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

        } catch(error) {
            console.error("DataBaseService.criarDataBaseLocal(): ", error.message)
            return {
                error: true,
                mensagemErro: error.message
            }
        }
        
    }
    static getDadosDataBasesConfiguradas = async({ db }) => {
        try {
            const result = await db.query(`SELECT * FROM Bases;`)
    
            const promiseTabelas = result[0].map(async(base, indice) => {
                return await this.getTabelasBase(base)
         
            })
    
            const tabelas = await Promise.all(promiseTabelas)
    
            const dadosBases = result[0].map((base, indice) => {
                base.tabelas = tabelas[indice]
                return base
            })
            
            return dadosBases
        } catch (error) {
            console.error("DataBaseService.getDadosDataBasesConfiguradas(): ", error.message)
            return {
                error: true,
                mensagemErro: error.message
            }
        }
    }
    static getConsulta = async ({ db }, sql) => {
        try {
            const result = await db.query(sql)
            return result[0]

        } catch(error) {
            console.error("DataBaseService.getConsulta(): ", error.message)
            return {
                error: true,
                mensagemErro: error.message
            }
        }
    }

    static get basesConectadas() {
        return this.#basesConectadas
    }
    static set basesConectadas(dadosBases) {
        this.#basesConectadas = dadosBases
    }
    static getTabelasBase = async (base) => {
        const { db } = new DataBase({ ...base })
        try {
            const schemas = await db.showAllSchemas()
            const tabelas = schemas.map(objeto => {
                const [ tabela ] = Object.entries(objeto)            
                return tabela[1]
            })
            return tabelas
        } catch(error) {
            console.error("DataBaseService.getTabelasBase(): ", error.message)
            return {
                error: true,
                mensagemErro: error.message
            }
        }
    }
    static getBaseId(id) {
        const base = this.#basesConectadas.filter(base => base.id == id)[0]
        return new DataBase({ ...base })
    }
}
// const result = await db.query(`SELECT name FROM sqlite_master WHERE type='table';`)

module.exports = DataBaseService