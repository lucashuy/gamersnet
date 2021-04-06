'use strict';

let MongoDB = require('./mongodb');

/**
 * find all the ratings of userId's owner from the database
 * @param {*} userID
 */
async function getUserRatingsDB(userID) {

  // wait for server to connect to db
  let db = await MongoDB.open();

  // once it connected, get the "ratings" collection (aka a table in SQL)
  let ratings = db.collection('ratings');


  // wait for the server to find all ratings and return as an array
  let result = await ratings.find({"userID" : userID});
  return result.toArray();
}


/**
 * get the rating made by the rater for the given user
 * @param {*} raterID 
 * @param {*} userID 
 * @returns 
 */
async function getRatingOfUserByRaterDB(userID, raterID) {

  // wait for server to connect to db
  let db = await MongoDB.open();

  // once it connected, get the "ratings" collection (aka a table in SQL)
  let ratings = db.collection('ratings');


  // wait for the server to find all ratings and return as an array
  let result = await ratings.findOne({"userID" : userID, "raterID" : raterID});//, "raterID" : raterID, "userID" : userID
  return result;
}

/**
 * add a new rating or update the existing one for the rater and user and return it.
 * @param {*} userID user being rated
 * @param {*} raterID user that is rating
 * @param {*} strength rate out of 5
 * @param {*} punctuality rate out of 5
 * @param {*} friendliness rate out of 5
 * @param {*} fun is the user fun to play with?
 * @param {*} playAgain would the user wanna play again?
 * @param {*} comment any comment on the user
 * @returns updated/newly added rating
 */
async function addRatingsDB(userID, raterID, strength, punctuality, friendliness, fun, playAgain, comment) {
  // wait for db connection and get ratings collection
  let db = await MongoDB.open();

  let ratings = db.collection('ratings');

  let result = await ratings.findOneAndUpdate(
    {
      "userID" : userID,
      "raterID" : raterID
    }, 
    {
      $set: {
        userID: userID,// intended to link to existing users in db
        raterID: raterID,
        strength: strength,
        punctuality: punctuality, 
        friendliness: friendliness, 
        fun: fun,
        playAgain: playAgain,
        rateDate: new Date(), //date of rating/ creation date = current date
        comment: comment
      }
    },
    { upsert: true , returnOriginal: false } // update and return the updated document
  );

  return result;
}

// make these functions "public" to the rest of the project
module.exports = {getUserRatingsDB, addRatingsDB, getRatingOfUserByRaterDB};

