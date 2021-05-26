const DataBaseService = require("./DataBaseService")
const JanelaService = require("./JanelaService")

class IPCService {
    executarQuery = async (event, data) => {
        const { base, sql } = data
        const database = DataBaseService.getBaseId(base)
        const retorno = await DataBaseService.getConsulta(database, sql)
        
        database.db.close()
        
        return retorno
    }
    carregarDadosIniciais = async (event, data, database) => {   
        const dadosBases = await DataBaseService.getDadosDataBasesConfiguradas(database)
        DataBaseService.basesConectadas = dadosBases
        
        event.reply('CarregandoDados', {
            bases: dadosBases
        })        
    }
    criarConexao = (event, data) => {
        JanelaService.createWindowCriarConexao()
    }
    salvarConexao = async (event, data, dataBaseLocal) => {
        let retorno = await DataBaseService.salvarDataBase({ db: dataBaseLocal.db, dados: data})
        return retorno
    }
    exibeMenuContexto = (tipoMenu=null) => {
        console.log("EXIBE_MENU_CONTEXTO")
        JanelaService.createMenuContextoDatabaseLista()
    }
}

module.exports = IPCService