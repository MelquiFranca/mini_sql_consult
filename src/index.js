const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const DataBaseService = require("./services/DataBaseService")
const IPCService = require('./services/IPCService')
const DataBase = require('./classes/Database')
const JanelaService = require('./services/JanelaService')

const dataBaseLocal = DataBaseService.criarDataBaseLocal()
/**
 * CONFIGURAÇÕES APP ELECTRON
 */
app.whenReady().then(JanelaService.createWindowMain)
app.on('window-all-closed',() => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate',() => {
    
    if(BrowserWindow.getAllWindows().length === 0) {
        JanelaService.createWindowMain()
    }
})
/**
 * EVENTOS IPC
 */
const ipcService = new IPCService()
ipcMain.handle('ExecutarQuery', ipcService.executarQuery)
ipcMain.on('Inicializacao', (event, data) => ipcService.carregarDadosIniciais(event, data, dataBaseLocal))

// const bases = DataBaseService.getDadosDataBasesConfiguradas(dataBaseLocal)
// const dataBasesConfiguradas = DataBaseService.criaDatabasesConfiguradas(bases)
