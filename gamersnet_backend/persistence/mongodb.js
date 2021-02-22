'use strict';

let mongodb = require('mongodb').MongoClient;
let {MongoMemoryServer} = require('mongodb-memory-server');

require('dotenv').config();

class MongoDB {
    static async open() {
        let url = '';

        if (process.env.NODE_ENV === 'test') {
            this.__testingServer = new MongoMemoryServer();

            url = await this.__testingServer.getUri();
        } else {
            url = 'mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PWRD + '@' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB;
        }

        // this is a singleton, we dont want to flood the server with lots of open connections
        // if we already connected to the database, just return that connection
        if (this.db) return this.db;
        
        // wait for the server to connect to the database
        this.__client = await mongodb.connect(url, {useUnifiedTopology: true})

        // get the database from the client and return it
        this.db = this.__client.db(process.env.MONGODB_DB);
        return this.db
    }

    static async close() {
        if (this.__testingServer) await this.__testingServer.stop();
        if (this.__client) await this.__client.close();
    }
}

module.exports = MongoDB;