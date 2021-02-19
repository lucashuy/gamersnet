'use strict';

let MongoDB = require('./mongodb');

async function getUsers() {
    // connect wait for server to connect to db
    let db = await MongoDB.open();

    // once it connected, get the "users" collection (aka a table in SQL)
    let users = db.collection('users');

    // wait for the server to find all users and return as an array
    let result = await users.find({});
    return result.toArray();;
}

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

    return await users.insertOne({username: username, password: hashedPassword});
}

// make these two functions "public" to the rest of the project
module.exports = {getUsers, addUser, getUserByUsername};