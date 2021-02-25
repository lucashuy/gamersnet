'use strict';

// include our function from the database to add post
let {addPost} = require('../../persistence/posts');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility')

let {getUserIDFromToken} = require('../../persistence/tokens.js')

// this function handles the /post/createPost/ endpoint
async function createPost(request, response) {
    let body = request.body;
    let cookie = request.headers.cookie;

    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }

    if (loggedIn && body.description && body.gameTimeUTC && body.gameName) {
        let tokenDocument = await getUserIDFromToken(cookie);

        //input type are verified here
        let userID = tokenDocument.userID;
        let numPlayers = parseInt(body.numPlayers);
        let gameTimeUTC = new Date(body.gameTimeUTC);

        await addPost(userID, body.description, body.gameName, numPlayers, gameTimeUTC, body.duration, body.location);
        response.status(204).end();
    } else {
        response.status(400).end();
    }
}

module.exports = {createPost};