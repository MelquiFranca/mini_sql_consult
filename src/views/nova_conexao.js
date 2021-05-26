const { ipcRenderer } = require('electron')
const selectTipoBanco = document.getElementById('tipo_banco')
const inputNomeDatabase = document.getElementById('nome_database')
const inputDatabase = document.getElementById('database')
const inputHost = document.getElementById('host')
const inputPorta = document.getElementById('porta')
const inputUsuario = document.getElementById('usuario')
const inputSenha = document.getElementById('senha')
const buttonSalvar = document.getElementById('salvar')
const buttonLimpar = document.getElementById('limpar')

/**
 * Handles de Eventos
 */
const handleClickLimpar = (e) => {
    e.preventDefault()

    limparCampos()
}
const validaFormulario = () => {
    if(selectTipoBanco.value == '') {
        alert('Favor selecionar o Tipo de Conexão.')
        return false
    }
    
    if(inputHost.value == '') {
        alert('Favor preencher o campo Host.')
        return false
    }
    if(inputNomeDatabase.value == '') {
        alert('Favor preencher o campo Nome da Base.')
        return false
    }
    if(selectTipoBanco.value != 'sqlite') {       
        if(inputDatabase.value == '') {
            alert('Favor preencher o campo Database.')
            return false
        }
        if(inputPorta.value == '') {
            alert('Favor preencher o Porta.')
            return false
        }
    }

    return true
}
const limparCampos = () => {
    selectTipoBanco.value = ''
    inputNomeDatabase.value = ''
    inputDatabase.value = ''
    inputHost.value = ''
    inputPorta.value = ''
    inputUsuario.value = ''
    inputSenha.value = ''
}
const handleClickSalvar = async (e) => {
    e.preventDefault()    

    if(!validaFormulario()) return

    const dados = {
        dialect : selectTipoBanco.value,
        name : inputNomeDatabase.value,
        database : inputDatabase.value,
        host : inputHost.value,
        port : inputPorta.value,
        user : inputUsuario.value,
        password : inputSenha.value,
    }

    const retorno = ipcRenderer.invoke('SalvarConexao', dados)
    if(retorno?.error) {
        alert(retorno.mensagemErro) 
        return
    }

    alert('Base cadastrada com sucesso.')

    limparCampos()
}

/**
 * Eventos
 */
buttonLimpar.addEventListener('click', handleClickLimpar)
buttonSalvar.addEventListener('click', handleClickSalvar)