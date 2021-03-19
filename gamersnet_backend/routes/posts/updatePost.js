'use strict';

// include our function from the database to add post
let {updatePost_db, getPost} = require('../../persistence/posts');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility')


/**
 * Helper function: updates specific post. User doesn't need to be logged in.
 * created this function to test update posts without worrying about tokens being expired.
 * (Don't wanna go and change expiry time in db everytime I test :/ )
 * @param {*} loggedUserID  the user that's trying to make changes
 * @param {*} request 
 * @param {*} response 
 * 
 * PLEASE DON'T USE THIS IN FRONTEND !! For backend testing only.
 */
async function updatePost_unauthorized(request, response) {
    let body = request.body;
    //console.log(request)

    if (body._id && body.description && body.gameTimeUTC && body.gameName) {
        //input type are verified here
        let numPlayers = parseInt(body.numPlayers);
        let gameTimeUTC = new Date(body.gameTimeUTC);
        let postID = body._id.$oid; //Object Id String

        await updatePost_db(postID, body.description, body.gameName, numPlayers, gameTimeUTC, body.duration, body.location);
        
        response.status(204).send("Updated post successfully.");
    } else {
        response.status(400).end();
    }

}

// this function handles the /post/createPost/ endpoint
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
        postUserID = null

        oldPost = getPost(body._id)
        if(oldPost.length > 0)
            postUserID = oldPost[0].userID

        if(loggedUserID.equals(postUserID)) //only the user who created the post can update it.
            updatePost_unauthorized(body._id, postUserID, body.description, body.gameName, numPlayers, gameTimeUTC, body.duration, body.location)
        else
            response.status(401).send('You are not authorized to change this post. Only owner of this post can change it.'); //status code: unauthorized
    } else {
        response.status(401).send('User not logged in.'); //status code: unauthorized
    }
}

module.exports = {updatePost_unauthorized };