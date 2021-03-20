'use strict';

// include our function from the database to add post
let {updatePostDB, getPost} = require('../../persistence/posts');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility')
let {getUserIDFromToken} = require('../../persistence/tokens.js')


/**
 * Helper function: updates specific post. User doesn't need to be logged in.
 * created this function to test update posts without worrying about tokens being expired.
 * (Don't wanna go and change expiry time in db everytime I test :/ )
 * @param {*} request 
 * @param {*} response 
 * 
 * PLEASE DON'T USE THIS IN FRONTEND !! For backend testing only.
 */
async function updatePostUnauthorized(request, response) {
    let body = request.body;
    //console.log(request)

    if (body._id && body.description && body.gameTimeUTC && body.gameName) {
        //input type are verified here
        let numPlayers = parseInt(body.numPlayers);
        let gameTimeUTC = new Date(body.gameTimeUTC);
        let postID = body._id.$oid; //Object Id String

        await updatePostDB(postID, body.description, body.gameName, numPlayers, gameTimeUTC, body.duration, body.location);

        response.status(201).send("Updated post successfully.");
    } else {
        response.status(400).end();
    }

}

/**
 * this function handles the /post/updatePost/ endpoint
 * Replaces the field values with the given ones in the db
 * @param {*} request  body should contain the postID(ObjectId or _id), description, gameName, numPlayers, gameTimeUTC, duration, location
 * @param {*} response 
 */
async function updatePost(request, response) {
    let body = request.body;
    let cookie = request.headers.cookie;

    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }

    if (loggedIn) {
        let tokenDocument = await getUserIDFromToken(cookie);

        //get logged in user id from token
        let loggedUserID = tokenDocument.userID;
        let postUserID = null

        let oldPost = await getPost(body._id.$oid)

        if(oldPost.length > 0){ //if the post exists, this check also ensures that
            // we don't get out of bounds error while getting userID
            postUserID = oldPost[0].userID
        }
            
        if(loggedUserID.equals(postUserID)) {//only the user who created the post can update it.
            console.log("Correct User.")
            updatePostUnauthorized(request, response)
        }  
        else{
            response.status(401).send('You are not authorized to change this post. Only owner of this post can change it.'); //status code: unauthorized
        }
    } else {
        response.status(401).send('User not logged in.'); //status code: unauthorized
    }
}

module.exports = {updatePostUnauthorized, updatePost };