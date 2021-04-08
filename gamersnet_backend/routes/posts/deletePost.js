'use strict';

// include our function from the database to add post
let {deletePost} = require('../../persistence/posts');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility')

let {getTokenDocument} = require('../../persistence/tokens.js')

// this function handles the /posts/deletePost endpoint
async function removePost(request, response) {
    let body = request.body;
    let cookie = request.headers.cookie;

    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }

    if (loggedIn) {
        let tokenDocument = await getTokenDocument(cookie);

        //input type are verified here
        let userID = tokenDocument.userID;

        // Later, we can use getPost(id) to find the user and if they don't match don't delete it
        // but for now checking deletedCount below will work!

        let _id = body.id;
        let result = await deletePost(_id , userID);

        // number of posts deleted; 1 if successful, 0 if not successful
        let deletedCount = result["deletedCount"];      
        if(deletedCount  == 1){
            response.status(204).send("Post successfully deleted!");
        }
        else{
            response.status(401).send("Post could not be deleted. Please try again later");
        } 
    } else {
        response.status(401).send("User not logged in");
    }
}

module.exports = {removePost};