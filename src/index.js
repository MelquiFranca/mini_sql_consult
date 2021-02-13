const { BrowserView, app } = require('electron')
const Database = require('./classes/Database')

const database = new Database({name: 'dev03', host: 'C:\\ProjetosProgramacao\\database.sql'})
