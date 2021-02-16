const DataBaseService = require("./DataBaseService")

class IPCService {
    executarQuery = async (event, data) => {
        const { base, sql } = data
        const database = DataBaseService.getBaseId(base)
        console.log(database)
        const retorno = await DataBaseService.getConsulta(database, sql)
        return retorno
    }
    carregarDadosIniciais = async (event, data, database) => {   
        const dadosBases = await DataBaseService.getDadosDataBasesConfiguradas(database)
        DataBaseService.basesConectadas = dadosBases
        
        event.reply('CarregandoDados', {
            bases: dadosBases
        })        
    }
}

module.exports = IPCService