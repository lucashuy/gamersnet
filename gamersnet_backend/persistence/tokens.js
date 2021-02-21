'use strict';

let MongoDB = require('./mongodb');

const TOKEN_LIFE_SPAN = 24 * 60 * 60 * 1000;

async function addUserToken(id, token) {
    let db = await MongoDB.open();
    let tokens = db.collection('tokens');

    return await tokens.insertOne(
        {
            userID: id,
            token: token,
            expires: Date.now() + TOKEN_LIFE_SPAN
        }
    );
}

module.exports = {addUserToken, TOKEN_LIFE_SPAN};