'use strict';

// include our function from the database to add post
let {deletePost} = require('../../persistence/posts');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility')

let {getUserIDFromToken} = require('../../persistence/tokens.js')

// this function handles the /posts/deletePost endpoint
async function deletePost(request, response) {
    let body = request.body;
    let cookie = request.headers.cookie;

    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }

    if (loggedIn) {
        let tokenDocument = await getUserIDFromToken(cookie);

        //input type are verified here
        let userID = tokenDocument.userID;

        let _id = body.id;
        await deletePost(_id , userID);
        response.status(204).end();
    } else {
        response.status(400).end();
    }
}

module.exports = {deletePost};