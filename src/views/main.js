const { ipcRenderer } = require('electron')

const btnExecutar = document.getElementById('executar')
const btnUltimaConsulta = document.getElementById('refreshUltimaConsulta')
const btnCancelar = document.getElementById('cancelar')
const btnNovaConexao = document.getElementById('novaConexao')
const txtSQL = document.getElementById('txtSql')
const tabelaResultados = document.getElementById('tabelaResultados')
const listaBasesConfiguradas = document.getElementById('databases')

// let listaBasesConectadas = []

ipcRenderer.sendSync('Inicializacao', {})
ipcRenderer.once('CarregandoDados', (event, { bases }) => {
    // listaBasesConectadas = bases
    preencheListaBasesConfiguradas(bases)
})

/**
 * Eventos
 */
const handleClickExecutar = async (e) => {
    e.preventDefault()    
    
    limparTabela()

    const listaBasesRadio = document.getElementsByName('listaBases')
    const baseSelecionada = Array.from(listaBasesRadio).filter(e => e.checked)
    if(!baseSelecionada.length) {
        alert('Nenhuma Base de Dados foi selecionada.')
        return
    }

    const retorno = await ipcRenderer.invoke('ExecutarQuery', {
        base: baseSelecionada[0].value,
        sql: txtSQL.value
    })
    
    const colunas = Object.keys(retorno[0])
    preencherTabela({ colunas, valores: retorno })

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
    if(!tabelaResultados.tBodies.length || !tabelaResultados.rows.length) 
        return
    
    tabelaResultados.deleteTHead()
    const linhasAtuais = tabelaResultados.rows
    Array.from(linhasAtuais).map(e => tabelaResultados.deleteRow(0))
}
const preencherTabela = ({ colunas, valores }) => {   
    
    const head = tabelaResultados.createTHead()
    const body = tabelaResultados.tBodies[0]
    head.classList.add('headResultado')

    const linha = head.insertRow()
    colunas.map((coluna, indice) => {
        const celula = linha.insertCell(indice)
        const texto = document.createTextNode(coluna)
        celula.appendChild(texto)
    })

    valores.map((dados) => {
        const linhaBody = body.insertRow()
        const celulas = Object.keys(dados)
        celulas.map((valor, indice) => {
            const celula = linhaBody.insertCell(indice)
            const texto = document.createTextNode(dados[valor])
            celula.appendChild(texto)
        })
    })
}
const preencheListaBasesConfiguradas = (bases) => {
    bases.map(base => {
        const li = document.createElement('li')
        const radio = document.createElement('input')
        const icon = document.createElement('i')
        const divIconRadio = document.createElement('div')
        const divTexto = document.createElement('div')
        
        radio.type = 'radio'
        radio.name = 'listaBases'
        radio.classList.add('listaBases')
        radio.value = base.id

        icon.classList.add('fa')
        icon.classList.add('fa-database')
        divIconRadio.classList.add('icon_radio')
        divTexto.classList.add('nome_base')

        divTexto.innerText = base.name,
        
        listaBasesConfiguradas.appendChild(li)
        divIconRadio.appendChild(radio)
        divIconRadio.appendChild(icon)
        li.appendChild(divIconRadio)
        li.appendChild(divTexto)
    })
}
/** 
 * Adicionando Eventos
*/
btnExecutar.addEventListener('click', handleClickExecutar)
btnUltimaConsulta.addEventListener('click', handleClickUltimaConsulta)
btnCancelar.addEventListener('click', handleClickCancelar)
btnNovaConexao.addEventListener('click', handleClickNovaConexao)