const { ipcRenderer } = require('electron')

const btnExecutar = document.getElementById('executar')
const btnUltimaConsulta = document.getElementById('refreshUltimaConsulta')
const btnCancelar = document.getElementById('cancelar')
const btnNovaConexao = document.getElementById('novaConexao')
const txtSQL = document.getElementById('txtSql')
const tabelaResultados = document.getElementById('tabelaResultados')

ipcRenderer.sendSync('Inicializacao', {})
ipcRenderer.once('CarregandoDados', (event, data) => {
    console.log(data)
})

/**
 * Eventos
 */
const handleClickExecutar = (e) => {
    e.preventDefault()
    ipcRenderer.invoke('ExecutarQuery', {
        base: '',
        sql: txtSQL.value
    })
}
const handleClickUltimaConsulta = (e) => {
    e.preventDefault()
    alert('Ultima Consulta')
}
const handleClickCancelar = (e) => {
    e.preventDefault()
    alert('Cancelar')
}
const handleClickNovaConexao = (e) => {
    e.preventDefault()
    alert('Nova Conexão')
}

/**
 * Funções
 */
const limparTabela = () => {
    if(!tabelaResultados.tBodies.length) 
        return
    
    tabelaResultados.deleteTHead()
    const linhasAtuais = tabelaResultados.tBodies[0]
    
    Array.from(linhasAtuais).map(e => tabelaResultados.deleteRow(0))
}
const preencherTabela = (resultado) => {   
    
    const head = tabelaResultados.createTHead()
    const body = tabelaResultados.tBodies[0]
    head.classList.add('headResultado')

    const linha = head.insertRow()
    resultado.colunas.map((coluna, indice) => {
        const celula = linha.insertCell(indice)
        const texto = document.createTextNode(coluna)
        celula.appendChild(texto)
    })

    resultado.valores.map((dados) => {
        const linhaBody = body.insertRow()
        const celulas = Object.keys(dados)
        celulas.map((valor, indice) => {
            const celula = linhaBody.insertCell(indice)
            const texto = document.createTextNode(dados[valor])
            celula.appendChild(texto)
        })
    })
}
/** 
 * Adicionando Eventos
*/
btnExecutar.addEventListener('click', handleClickExecutar)
btnUltimaConsulta.addEventListener('click', handleClickUltimaConsulta)
btnCancelar.addEventListener('click', handleClickCancelar)
btnNovaConexao.addEventListener('click', handleClickNovaConexao)
