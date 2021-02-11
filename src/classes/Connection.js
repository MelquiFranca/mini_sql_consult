const Knex = require('knex')
const path = require('path')
const fs = require('fs')
// const crypto = require('crypto')
class Connection {
    #name
    #host
    #user
    #db

    constructor({ name, host, client = 'sqlite3', user=null, password=null, database=null }) {
        this.#name = name
        this.#host = host
        this.#user = user        
        
        let options 
        if(client == 'sqlite3') {
            if(fs.existsSync(path.join(path.resolve(this.#host)))) {
                options = { filename: path.join(path.resolve(this.#host))} 
            }
        } else {
            options = {host, password, user, database}
        }
                
        const newConnection = Knex({
            client: client,
            connection: options,
            useNullAsDefault: true
        }) 

        this.#db = newConnection
    }    
    get db () {
        return this.#db
    }
    get name () {
        return this.#name
    }
    get host () {
        return this.#host
    }
}

module.exports = Connection