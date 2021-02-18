'use strict';

let mongodb = require('mongodb').MongoClient;

require('dotenv').config();

class MongoDB {
    static async open() {
        // this is a singleton, we dont want to flood the server with lots of open connections
        // if we already connected to the database, just return that connection
        if (this.db) return this.db;
        
        // create our url
        // this is in format of: mongodb://username:password@server_ip:port/database_name
        let url = 'mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PWRD + '@' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB;

        // wait for the server to connect to the database
        this.__client = await mongodb.connect(url, {useUnifiedTopology: true})

        // get the database from the client and return it
        this.db = this.__client.db(process.env.MONGODB_DB);
        return this.db
    }
}

module.exports = MongoDB;