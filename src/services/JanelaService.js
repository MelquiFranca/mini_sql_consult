const { BrowserWindow, nativeImage } = require('electron')
const path = require('path')
const icone = nativeImage.createFromPath(path.join(path.resolve('src','views', 'images', 'icone.png')))

class JanelaService {
    static #janelaMain = undefined
    static #janelaCriarConexao = undefined
    
    static createWindowMain = () => {

        this.#janelaMain = new BrowserWindow({
            title: 'Mini SQL Consult',
            width: 800,
            minWidth: 350,
            height: 600,
            minHeight: 500,
            thickFrame: true,
            backgroundColor: '#333',
            icon: icone,
            darkTheme: true,
            webPreferences: {
                scrollBounce: true,
                nodeIntegration: true,
                textAreasAreResizable: false,
                // devTools: false,
            },
            autoHideMenuBar: true,        
        })    
        // this.#janelaMain.maximize()
        // this.#janelaMain.webContents.openDevTools()
        this.#janelaMain.loadFile(path.join('views', 'main.html'))
    }
    static createWindowCriarConexao = (parent) => {
        if(!this.#janelaCriarConexao) {

            this.#janelaCriarConexao = new BrowserWindow({
                parent,
                modal: true,                
                title: 'Mini SQL Consult',
                width: 500,
                height: 500,
                icon: icone,
                resizable: false,
                focusable: true,
                thickFrame: true,
                backgroundColor: '#333',
                darkTheme: true,
                webPreferences: {
                    nodeIntegration: true,
                    textAreasAreResizable: false,
                    // devTools: false,
                },
                autoHideMenuBar: true,
            })    
            // this.#janelaCriarConexao.maximize()
            // this.#janelaCriarConexao.webContents.openDevTools()
            this.#janelaCriarConexao.loadFile(path.join('views', 'nova_conexao.html'))
        } else {
            this.#janelaCriarConexao.show()
        }

    }

    static get janelaMain () {
        return this.#janelaMain
    }
    static get janelaCriarConexao () {
        return this.#janelaCriarConexao
    }


}

module.exports = JanelaService