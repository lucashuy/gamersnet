'use strict';

let MongoDB = require('./mongodb');

async function getPosts() {
    // connect wait for server to connect to db
    let db = await MongoDB.open();

    // once it connected, get the "posts" collection (aka a table in SQL)
    let posts = db.collection('posts');

    // wait for the server to find all posts and return as an array
    let result = await posts.find({});
    return result.toArray();;
}

async function addPost(username, content) {
    // wait for db connection and get users collection
    let db = await MongoDB.open();
    let posts = db.collection('posts');

    // insert one row into the database, where the username key is our parameter
    return await posts.insertOne({username: username, content: content});

    // return something...
    // return {status: 200};
}

// make these two functions "public" to the rest of the project
module.exports = {getPosts, addPost};