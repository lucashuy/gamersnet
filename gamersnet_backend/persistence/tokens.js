'use strict';

let MongoDB = require('./mongodb');

const TOKEN_LIFE_SPAN = 24 * 60 * 60 * 1000;
let db, tokens;

async function connect() {
    // connect wait for server to connect to db
    db = await MongoDB.open();

    // once it connected, get the "users" collection (aka a table in SQL)
    tokens = db.collection('tokens');
}

async function addUserToken(id, token) {
    await connect();

    return await tokens.insertOne(
        {
            userID: id,
            token: token,
            expires: Date.now() + TOKEN_LIFE_SPAN
        }
    );
}

async function updateUserToken(id, token) {
    await connect();

    // find a document by searching userIDs
    // this does nothing if it cannot find the right document
    return await tokens.findOneAndUpdate(
        {userID: id},
        {
            $set: {
                token: token,
                expires: Date.now() + TOKEN_LIFE_SPAN
            }
        }
    );
}

module.exports = {addUserToken, TOKEN_LIFE_SPAN, updateUserToken};