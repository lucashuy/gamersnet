'use strict';

// include our function from the database to add post
let {addRatingsDB} = require('../../persistence/ratings');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility')

let {getUserIDFromToken} = require('../../persistence/tokens.js')
const { ObjectID } = require('bson');

// this function handles the /post/createPost/ endpoint
async function addRatings(request, response) {
    let body = request.body;
    let cookie = request.headers.cookie;
    let verifyBody = body.userID && body.strength && body.punctuality 
                        && body.friendliness &&  body.fun && body.playAgain // commenting on profile is optional

    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }

    if (loggedIn && verifyBody) {
        let tokenDocument = await getUserIDFromToken(cookie);
        let raterID = tokenDocument.userID;

        // users can't rate their own profiles.
        if(!raterID.equals(ObjectID(body.userID))) {
            await addRatingsDB(ObjectID(body.userID), raterID, body.strength, body.punctuality, body.friendliness, body.fun, body.playAgain, body.comment);
            response.status(201).end();
        } else {
            response.status(401).end('You cannot rate your own profile.');
        }          
    } 
    else {
        if(!loggedIn)
            response.status(401).end('User not logged in. Log in to rate a profile.');
        else
            response.status(400).end();
    }
}

module.exports = {addRatings};