const { BrowserWindow } = require('electron')
const path = require('path')


class JanelaService {
    static createWindowMain = () => {
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
        // window.maximize()
        // window.webContents.openDevTools()
        window.loadFile(path.join('views', 'main.html'))
    }
    static createWindowCriarConexao = () => {
        const window = new BrowserWindow({
            title: 'Mini SQL Consult',
            width: 500,
            height: 500,
            resizable: false,
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
        // window.maximize()
        // window.webContents.openDevTools()
        window.loadFile(path.join('views', 'nova_conexao.html'))
    }
}

module.exports = JanelaService