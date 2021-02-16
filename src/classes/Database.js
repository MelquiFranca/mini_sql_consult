const { Sequelize } = require('sequelize')
const path = require('path')
const fs = require('fs')
// const crypto = require('crypto')

class DataBase {
    #id
    #name
    #host
    #port
    #user
    #dialect
    #database
    #password
    #db

    constructor({ id, name, host, dialect = 'sqlite', user=null, password=null, database=null, port=null, create=false }) {
        this.#id = id
        this.#name = name
        this.#host = host
        this.#port = port
        this.#user = user        
        this.#dialect = dialect        
        this.#database = database        
        this.#password = password
        this.#db
        
        if(dialect == 'sqlite') {
            if(fs.existsSync(path.join(path.resolve(host))) || create) {
                const newConnection = new Sequelize({
                    dialect,
                    storage: path.join(host)
                  })
                this.#db = newConnection
            }            

        } else {
            const newConnection = new Sequelize(database, user, password, { 
                host: host, 
                dialect
            })     
            this.#db = newConnection
        }   
    }    
    get id () {
        return this.#id
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