'use strict';

let mongodb = require('mongodb').MongoClient;

require('dotenv').config();

class MongoDB {
    static async open() {
        if (this.db) return this.db;
        
        let url = 'mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PWRD + '@' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB;
        this.__client = await mongodb.connect(url, {useUnifiedTopology: true})

        this.db = this.__client.db(process.env.MONGODB_DB);
        return this.db
    }
}

module.exports = MongoDB;