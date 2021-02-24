'use strict';

let MongoDB = require('./mongodb');
let db, users;

async function connect() {
    // connect wait for server to connect to db
    db = await MongoDB.open();

    // once it connected, get the "users" collection (aka a table in SQL)
    users = db.collection('users');
}

async function getUserByUsername(username) {
    await connect();

    let result = users.findOne({username: username});
    return result;
}

async function addUser(username, hashedPassword) {
    await connect();

    return await users.insertOne({username: username, password: hashedPassword});
}

module.exports = {addUser, getUserByUsername};