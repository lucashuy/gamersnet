'use strict';


// include our function from the database to fetch ratings
let {getUserRatingsDB, getRatingOfUserByRaterDB} = require('../../persistence/ratings');

const { ObjectID } = require('bson');

// this function handles the /ratings/getUserRatings/ endpoint
async function getUserRatings(request, response) {
    //user doesn't need to be logged in to view user ratings
    let userID = request.query.userID;
    let results = await getUserRatingsDB(ObjectID(userID));
    if(results.length > 0) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end();
    }
}

/**
 * 
 * @param {*} request query with userID, and raterID
 * @param {*} response respond with the rating found for the user by the rater
 */
async function getRatingOfUserByRater(request, response) {
    //user doesn't need to be logged in to view user ratings
    let userID = request.query.userID;
    let raterID = request.query.raterID;
    let results = await getRatingOfUserByRaterDB(ObjectID(userID), ObjectID(raterID));

    if(results) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end();
    }
}

/**
 * 
 * @param {*} request //pass in the userID of the profile in the query
 * @param {*} response 
 * 
 * responds with:
 * {userID: , 
 * strength: average rated strength
 * punctuality: average rated punctuality
 * friendliness: average rated friendliness
 * fun: average rated fun
 * playAgain: percentage of players that want to play again with this user
 * comments: [{
 *                raterID:
 *                rateDate:
 *                comment:
 *            }, ...]
 * }
 */
async function getUserAvgRatings(request, response) {
    //user doesn't need to be logged in to view user ratings
    let avgResult = {
        userID: "",// intended to link to existing users in db
        strength: "",
        punctuality: "", 
        friendliness: "", 
        fun: "",
        playAgain: "",
        comments: []
    }

    let userID = request.query.userID;
    
    let results = await getUserRatingsDB(ObjectID(userID));
    if(results.length > 0) {
        let strength = 0;
        let punctuality = 0; 
        let friendliness = 0; 
        let fun = 0;
        let playAgain = 0;
        let comments = [];
        
        let i = 0;
        for(i = 0; i < results.length; i++){
            strength += results[i].strength;
            punctuality += results[i].punctuality; 
            friendliness += results[i].friendliness; 
            fun += results[i].fun;
            if(results[i].playAgain === true)
                playAgain += 1;
            comments.push({
                raterID: results[i].raterID,
                rateDate: results[i].rateDate,
                comment: results[i].comment
            })
        }
        avgResult.userID = ObjectID(userID) 
        avgResult.strength = strength/results.length;
        avgResult.punctuality = punctuality/results.length; 
        avgResult.friendliness = friendliness/results.length; 
        avgResult.fun = fun/results.length;
        avgResult.playAgain = (playAgain/results.length)*100;
        avgResult.comments = comments;

        response.json(avgResult);
        response.status(200).end();
    } else {
        response.status(404).end();
    }
}


module.exports = {getUserRatings, getUserAvgRatings, getRatingOfUserByRater};
