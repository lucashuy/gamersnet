'use strict';

let MongoDB = require('./mongodb');
let ObjectId = require('mongodb').ObjectID;
const MAX_MONTHS_POST_VIEW = 2;//see posts within 2 months from today

async function getAllPosts() {
  // connect wait for server to connect to db
  let db = await MongoDB.open();

  // once it connected, get the "posts" collection (aka a table in SQL)
  let posts = db.collection('posts');

  // wait for the server to find all posts and return as an array
  let result = await posts.find({});
  return result.toArray();
}

//assuming posts expire if the gametime is older than current time
//so get posts from today upto one month
async function getValidPosts() {
    let db = await MongoDB.open();
    let posts = db.collection('posts');

    let upperLimit = new Date(new Date().setMonth(new Date().getMonth() + MAX_MONTHS_POST_VIEW));
    
    let result = await posts.find({ gameTimeUTC: {$gte: new Date(), $lte: upperLimit}});

    return result.toArray();
}


/**
 * Adds a post to the db
 * All parameters should be string type to be consistent and avoid confusion
 * @param {*} username name of the owner of this post
 * @param {*} description 
 * @param {*} gameName 
 * @param {*} numPlayers 
 * @param {*} gameTimeUTC when it will be played
 * @param {*} duration how long will it be played
 * @param {*} location location of game
 */
async function addPost(username, description, gameName, numPlayers, gameTimeUTC, duration, location) {
  // wait for db connection and get users collection
  let db = await MongoDB.open();

  let posts = db.collection('posts');

  return await posts.insertOne({
    username: username,// intended to link to existing users in db
    description: description,
    gameName: gameName,
    numPlayers: parseInt(numPlayers, 10), //null in case of incorrect format
    gameTimeUTC: new Date(gameTimeUTC), 
    duration: duration,
    location: location
  })
}

// make these two functions "public" to the rest of the project
module.exports = { getAllPosts, addPost, getValidPosts };
