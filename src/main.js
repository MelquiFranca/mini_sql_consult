const path = require('path')
const DataBaseService = require('./services/DataBaseService')
const DataBase = require('./classes/DataBase')


// const dataBaseService = new DataBaseService()
const init = async () => {
    DataBaseService.criarDataBaseLocal()
    const database = new DataBase({name: '', host: path.join('database.sqlite')})
    const retorno = await DataBaseService.getNomeDataBasesConfiguradas(database)
}

init()