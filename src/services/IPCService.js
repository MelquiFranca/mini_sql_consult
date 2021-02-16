const DataBaseService = require("./DataBaseService")

class IPCService {
    executarQuery(event, data) {
        console.log(data)
    }
    async carregarDadosIniciais(event, data, database) {
        DataBaseService.criarDataBaseLocal()    
        const dadosBases = await DataBaseService.getNomeDataBasesConfiguradas(database)
        const bases = await DataBaseService.criaDatabasesConfiguradas(dadosBases)
        console.log(bases)
        event.reply('CarregandoDados', {
            bases
        })        
    }
}

module.exports = IPCService