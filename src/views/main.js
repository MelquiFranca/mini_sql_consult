const { ipcRenderer } = require('electron')

const btnExecutar = document.getElementById('executar')
const btnUltimaConsulta = document.getElementById('refreshUltimaConsulta')
const btnCancelar = document.getElementById('cancelar')
const btnNovaConexao = document.getElementById('novaConexao')
const txtSQL = document.getElementById('txtSql')
const tabelaResultados = document.getElementById('tabelaResultados')
const listaBasesConfiguradas = document.getElementById('databases')

ipcRenderer.sendSync('Inicializacao', {})
ipcRenderer.once('CarregandoDados', (event, { bases }) => {
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
    
    if(retorno.error) {
        limparTabela()
        exibeMensagemErro(retorno)   
        return
    }
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
    ipcRenderer.invoke('CriarConexao', {})
}
const handleChangeTextoSQL = (e) => {
    formataPalavraChaveSQL(e.target)
}
const handleChangeBases = (e) => {
    const listaBasesRadio = document.getElementsByName('listaBases')
    Array.from(listaBasesRadio).map(e => {
        const li = e.parentNode.parentNode.parentNode
        e.checked ? 
            li.classList.add('base_selecionada') : 
            li.classList.remove('base_selecionada')
    })
}
const handleClickListaTabelas = ({target}) => {    
    const ul = target.parentNode.parentNode.parentNode.querySelector('.lista_tabelas')

    if(ul.classList && ul.classList.contains('lista_tabelas_oculta')) {
        target.classList.remove('fa-eye-slash')
        target.classList.add('fa-eye')
        ul.classList.remove('lista_tabelas_oculta')
    } else if(ul.classList) {
        target.classList.add('fa-eye-slash')
        target.classList.remove('fa-eye')
        ul.classList.add('lista_tabelas_oculta')
    }
}
const handleSelectBase = ({target}) => {    
    const radio = target.querySelector('.listaBases') ? 
    target.querySelector('.listaBases') : 
        (target.parentNode.querySelector('.listaBases') ? 
        target.parentNode.querySelector('.listaBases') : 
        target.parentNode.parentNode.querySelector('.listaBases') )
    
    if(radio && radio.classList.contains('listaBases') && !radio.checked)  {
        radio.checked = true
        handleChangeBases()
    }
}
const handleDoubleClickTabela = (e) => {
    e.stopPropagation()
    handleSelectBase(e.target.parentNode)
    const tabela = e?.target.querySelector('div') ? e.target.querySelector('div').innerText : e.target.innerText
    txtSQL.value = `SELECT * FROM ${tabela};`
}
const ARRAY_PALAVRAS_CHAVE = [
    'select', 'from', 'where',
    'limit','order', 'by', 'group', 
    'on', 'join', 'inner', 
    'left', 'right','desc',
    'asc', 'distinct', 'count'
]

const formataPalavraChaveSQL = (element) => {        
    ARRAY_PALAVRAS_CHAVE.map(palavra => {
        const textRegex = `(\\W)${palavra}(\\W)|^${palavra}(\\W)`;
        // const textRegex = `(\\W)${palavra}(\\W)`;
        const regex = new RegExp(textRegex, 'gi');
        
        if(element.value.search(regex) >= 0) {
            const texto = txtSQL.value.match(regex)[0]
            txtSQL.value = element.value.replaceAll(regex, texto.toUpperCase())
        }
    })
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
const exibeCountRegistros = (registros) => {
    const contadorResultados = document.getElementById('countResultado')
    contadorResultados.innerText = `Registros encontrados: ${registros}`
}
const preencherTabela = ({ colunas, valores }) => {   
    
    const head = tabelaResultados.createTHead()
    const body = tabelaResultados.tBodies[0]
    
    exibeCountRegistros(valores.length)

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
const exibeMensagemErro = ({mensagemErro}) => {
    
    const body = tabelaResultados.tBodies[0]
    const linhaBody = body.insertRow()    
    linhaBody.classList.add('mensagemErro')
    const celula = linhaBody.insertCell(0)
    const texto = document.createTextNode(mensagemErro)

    celula.appendChild(texto)

}
const preencheListaBasesConfiguradas = (bases) => {     
    if(bases.length) {
        const ul = document.createElement('ul')   
        ul.classList.add('basesConfiguradas')
        ul.name = 'basesConfiguradas'
        ul.id = 'basesConfiguradas'

        bases.map((base, indice) => {
            const li = document.createElement('li')
            const radio = document.createElement('input')
            const icon = document.createElement('i')
            const divCabecalho = document.createElement('div')
            const divIconRadio = document.createElement('div')
            const divTexto = document.createElement('div')
            const buttonExibeOcultaTabelas = document.createElement('button')
            const iconButtonExibe = document.createElement('i')
            const buttonEdita = document.createElement('button')
            const iconButtonEdita = document.createElement('i')
            
            radio.type = 'radio'
            radio.id = `listaBases_${indice}`
            radio.name = 'listaBases'
            radio.classList.add('listaBases')
            li.classList.add('item_base')            
            radio.value = base.id
            
            radio.addEventListener('change', handleChangeBases)
    
            icon.classList.add('fa')
            icon.classList.add('fa-database')
            divCabecalho.classList.add('cabecalho')
            divIconRadio.classList.add('icon_radio')
            divTexto.classList.add('nome_base')            
            buttonEdita.classList.add('editaDatabase')            
            iconButtonEdita.classList.add('fa')
            iconButtonEdita.classList.add('fa-pencil')
    
            buttonEdita.addEventListener('click', ()=>{})
            divTexto.innerText = `${base.dialect.toUpperCase()} - ${base.name.toLowerCase()}`,
            
            buttonEdita.appendChild(iconButtonEdita)
            divIconRadio.appendChild(radio)
            divIconRadio.appendChild(icon)
            divCabecalho.appendChild(divIconRadio)
            divCabecalho.appendChild(divTexto)
            divCabecalho.appendChild(buttonEdita)
            li.appendChild(divCabecalho)
            
            if(base.tabelas.length) {
                iconButtonExibe.classList.add('fa')
                iconButtonExibe.classList.add('fa-eye-slash')
                buttonExibeOcultaTabelas.classList.add('expandeListaTabelas')
                buttonExibeOcultaTabelas.addEventListener('click', handleClickListaTabelas)
                buttonExibeOcultaTabelas.appendChild(iconButtonExibe)
                divCabecalho.appendChild(buttonExibeOcultaTabelas)
                preencheTabelasBase(li, base.tabelas)
            }
            
            li.addEventListener('click', handleSelectBase)
            
            ul.appendChild(li)
        })

        listaBasesConfiguradas.appendChild(ul)
    } else {
        const divSemConteudo = document.createElement('div')
        divSemConteudo.innerText = 'Nenhuma base registrada.'
        divSemConteudo.classList.add('nome_base')
        listaBasesConfiguradas.appendChild(divSemConteudo)
    }

    
}

const preencheTabelasBase = (base, tabelas) => {
    if(!tabelas.length)
        return

    const ul = document.createElement('ul')
    ul.classList.add('lista_tabelas')
    ul.classList.add('lista_tabelas_oculta')

    tabelas.map(tabela => {
        const li = document.createElement('li')
        const icon = document.createElement('i')
        const divNome = document.createElement('div')

        li.classList.add('tabela')
        icon.classList.add('fa')
        icon.classList.add('fa-table')

        divNome.innerText = tabela
        li.name = tabela

        li.addEventListener('dblclick', handleDoubleClickTabela)
        li.appendChild(icon)
        li.appendChild(divNome)
        ul.appendChild(li)
    })

    base.appendChild(ul)
}
/** 
 * Adicionando Eventos
*/
btnExecutar.addEventListener('click', handleClickExecutar)
btnUltimaConsulta.addEventListener('click', handleClickUltimaConsulta)
btnCancelar.addEventListener('click', handleClickCancelar)
btnNovaConexao.addEventListener('click', handleClickNovaConexao)
txtSQL.addEventListener('keyup', handleChangeTextoSQL)
// window.addEventListener('contextmenu', (e) => {
//     ipcRenderer.invoke('ExibeMenuContexto')
// })