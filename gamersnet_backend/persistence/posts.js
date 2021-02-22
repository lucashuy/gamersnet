'use strict';

let MongoDB = require('./mongodb');
let ObjectId = require('mongodb').ObjectID;

async function getPosts() {
  // connect wait for server to connect to db
  let db = await MongoDB.open();

  // once it connected, get the "posts" collection (aka a table in SQL)
  let posts = db.collection('posts');

  // wait for the server to find all posts and return as an array
  let result = await posts.find({});
  return result.toArray();
}

/**
 * Adds a post to the db
 * All parameters should be string type to be consistent and avoid confusion
 * @param {*} userId id of the owner of this post
 * @param {*} description 
 * @param {*} gameName 
 * @param {*} numPlayers 
 * @param {*} localGameTime when it will be played
 * @param {*} duration how long will it be played
 * @param {*} location location of game
 */
async function addPost(userId, description, gameName, numPlayers, localGameTime, duration, location) {
  // wait for db connection and get users collection
  let db = await MongoDB.open();

  let posts = db.collection('posts');

  return await posts.insertOne({
    userId: ObjectId(userId),// intended to link to existing users in db, otherwise new id is generated
    description: description,
    gameName: gameName,
    numPlayers: parseInt(numPlayers, 10), //null in case of incorrect format
    localGameTime: new Date(localGameTime), 
    duration: duration,
    location: location
  })
}

// make these two functions "public" to the rest of the project
module.exports = { getPosts, addPost };
