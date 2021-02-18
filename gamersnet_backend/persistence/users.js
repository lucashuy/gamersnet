'use strict';

let MongoDB = require('./mongodb');

async function getUsers() {
    let db = await MongoDB.open();
    let users = db.collection('users');

    let result = await users.find({});
    return result.toArray();;
}

async function addUser(username) {
    let db = await MongoDB.open();
    let users = db.collection('users');

    users.insertOne({username: username});

    return {status: 200};
}

module.exports = {getUsers, addUser};