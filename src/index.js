const { BrowserView, app } = require('electron')
const Connection = require('./classes/Connection')

const connection = new Connection({name: 'dev03', host: 'C:\\Android\\database.sql'})
