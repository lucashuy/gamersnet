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

async function addUser(username) {
    // wait for db connection and get users collection
    let db = await MongoDB.open();
    let users = db.collection('users');

    // insert one row into the database, where the username key is our parameter
    users.insertOne({username: username});

    // return something...
    return {status: 200};
}

// make these two functions "public" to the rest of the project
module.exports = {getUsers, addUser};