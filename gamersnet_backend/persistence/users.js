'use strict';

let MongoDB = require('./mongodb');

async function getUserByUsername(username) {
    let db = await MongoDB.open();
    let users = db.collection('users');

    let result = users.findOne({username: username});
    return result;
}

async function addUser(username, hashedPassword) {
    // wait for db connection and get users collection
    let db = await MongoDB.open();
    let users = db.collection('users');

    return await users.insertOne(
        {
            username: username,
            password: hashedPassword
        }
    );
}

// make these two functions "public" to the rest of the project
module.exports = {addUser, getUserByUsername};