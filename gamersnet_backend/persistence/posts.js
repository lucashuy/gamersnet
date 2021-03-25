'use strict';

const { ObjectID } = require('bson');
let MongoDB = require('./mongodb');

async function getPost(_id) {
  // connect wait for server to connect to db
  let db = await MongoDB.open();

  // once it connected, get the "posts" collection (aka a table in SQL)
  let posts = db.collection('posts');

  // wait for the server to find the specified post
  let result = await posts.findOne({ _id : ObjectID(_id)});

  return result;
}

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
//so get posts for games scheduled today or in future
async function getValidPosts() {
    let db = await MongoDB.open();
    let posts = db.collection('posts');
    
    let result = await posts.find({ gameTimeUTC: {$gte: new Date()}});

    return result.toArray();
}


/**
 * Adds a post to the db
 * All parameters should be string type to be consistent and avoid confusion
 * @param {*} userId userId of the owner of this post
 * @param {*} description 
 * @param {*} gameName 
 * @param {*} numPlayers 
 * @param {*} gameTimeUTC when it will be played
 * @param {*} duration how long will it be played
 * @param {*} location location of game
 */
async function addPost(userID, description, gameName, numPlayers, gameTimeUTC, duration, location) {
  // wait for db connection and get users collection
  let db = await MongoDB.open();

  let posts = db.collection('posts');

  let result = await posts.insertOne({
    userID: userID,// intended to link to existing users in db
    description: description,
    gameName: gameName,
    numPlayers: numPlayers, //null in case of incorrect format
    gameTimeUTC: gameTimeUTC, 
    duration: duration,
    location: location
  })


  return result;
}

async function deletePost(_id, userID){
  let db = await MongoDB.open();

  let posts = db.collection('posts');

  // just making sure the post is only deleted by the user that created it , just a note; for some reason (unknown)
  // passing in userID was not working 
  return await posts.deleteOne({"_id" : ObjectID(_id), userID}); 
}

/**
 * updates the specified post(by post id) and returns the updated document.
 * All parameters should be string type to be consistent and avoid confusion
 * @param {*} userID userId of the owner of this post
 * @param {*} description 
 * @param {*} gameName 
 * @param {*} numPlayers 
 * @param {*} gameTimeUTC when it will be played
 * @param {*} duration how long will it be played
 * @param {*} location location of game
 */
 async function updatePostDB(_id, description, gameName, numPlayers, gameTimeUTC, duration, location) {
  // wait for db connection and get users collection
  let db = await MongoDB.open();

  let posts = db.collection('posts');
 
  var updateValues = {
    $set: {
      description: description,
      gameName: gameName,
      numPlayers: numPlayers, //null in case of incorrect format
      gameTimeUTC: gameTimeUTC, 
      duration: duration,
      location: location
    }
  };

  let updated = await posts.findOneAndUpdate({ _id: ObjectID(_id)}, updateValues, {returnOriginal: false});

  return updated;
}

async function getPostsBetweenDatesDB(startDateUTC, endDateUTC) {
  let db = await MongoDB.open();
  let posts = db.collection('posts');
  let result = [];

  if(startDateUTC && endDateUTC) {
    result = await posts.find({ gameTimeUTC: {$gte: startDateUTC, $lte: endDateUTC}});
    return result.toArray()
  }
  else if(startDateUTC && !endDateUTC) {
    result = await posts.find({ gameTimeUTC: {$gte: startDateUTC}});
    return result.toArray()
  }
  else if(!startDateUTC && endDateUTC) {
    result = await posts.find({ gameTimeUTC: {$lte: endDateUTC}});
    return result.toArray()
  }
  else {//else return the list of valid posts
    result = await posts.find({ gameTimeUTC: {$gte: new Date()}});
    return result.toArray()
  }
}

async function getPostsWithText(text) {
  //search each word of the text in db.posts text fields (description, gameName, location)
  let db = await MongoDB.open();
  let posts = db.collection('posts');
  posts.createIndex( { gameName: "text", description: "text" , location: "text"} )

  // if text == "java coffee shop" -> All posts with "java" or "coffee" or "shop" or all 
  // if text == "\"coffee shop\"" -> Exact Phrase
  // if text == "java shop -coffee" -> Term Exclusion(excluding coffee)
  // see: https://docs.mongodb.com/manual/text-search/ for details
    
  let result = await posts.find( { $text: { $search: text } } )

  return result.toArray();
}


// may do it in sprint 4
// TODO: may add a tags field in post to search by keywords
// async function getPostsWithTag(startDateUTC, endDateUTC) {
  
// }

// async function getPostsByNumPlayers(min, max) {
  
// }

module.exports = {getPost, getAllPosts, addPost, getValidPosts, updatePostDB, deletePost, getPostsBetweenDatesDB, getPostsWithText};
