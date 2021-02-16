const { Sequelize } = require('sequelize')
const path = require('path')
const fs = require('fs')
// const crypto = require('crypto')

class DataBase {
    #name
    #host
    #port
    #user
    #password
    #db

    constructor({ name, host, client = 'sqlite', user=null, password=null, database=null, port=null, create=false }) {
        this.#name = name
        this.#host = host
        this.#port = port
        this.#user = user        
        this.#password = password
        this.#db
        
        if(client == 'sqlite') {
            if(fs.existsSync(path.join(path.resolve(host))) || create) {
                const newConnection = new Sequelize({
                    dialect: client,
                    storage: path.join(host)
                  })
                this.#db = newConnection
            }            

        } else {
            const newConnection = new Sequelize(database, user, password, { 
                host: host, 
                dialect: client 
            })     
            this.#db = newConnection
        }   
    }    
    get db () {
        return this.#db
    }
    get name () {
        return this.#name
    }
    get user () {
        return this.#user
    }
    get password () {
        return this.#password
    }
    get port () {
        return this.#port
    }
    get host () {
        return this.#host
    }
}

module.exports = DataBase