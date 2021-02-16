const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const DataBaseService = require("./services/DataBaseService")
const IPCService = require('./services/IPCService')
const DataBase = require('./classes/Database')

const createWindow = () => {
    const window = new BrowserWindow({
        title: 'Mini SQL Consult',
        width: 800,
        minWidth: 350,
        height: 600,
        minHeight: 500,
        thickFrame: true,
        backgroundColor: '#000',
        darkTheme: true,
        webPreferences: {
            nodeIntegration: true,
            textAreasAreResizable: false,
            // devTools: false,
        },
        autoHideMenuBar: true,        
    })    
    window.loadFile(path.join('views', 'main.html'))
}
/**
 * CONFIGURAÇÕES APP ELECTRON
 */
app.whenReady().then(createWindow)
app.on('window-all-closed',() => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate',() => {
    
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

/**
 * EVENTOS IPC
 */
const dataBaseLocal = new DataBase({name: '', host: path.join('database.sqlite')})
const ipcService = new IPCService()

ipcMain.handle('ExecutarQuery', ipcService.executarQuery)
ipcMain.on('Inicializacao', (event, data) => ipcService.carregarDadosIniciais(event, data, dataBaseLocal))
// const dataBasesConfiguradas = DataBaseService.getDatabases()
