'use strict';


// include our function from the database to fetch posts
let {getUserPosts, getAllPosts, getValidPosts} = require('../../persistence/posts');

let {verifyUserLoggedIn} = require('../utilities/tokenUtility')

let {getUserIDFromToken} = require('../../persistence/tokens.js')

// this function handles the /posts/listUserPosts/ endpoint
async function listAllUserPosts(request, response) {
    let cookie = request.headers.cookie;

    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }

    if (loggedIn){
        let tokenDocument = await getUserIDFromToken(cookie);

        //input type are verified here
        let userID = tokenDocument.userID;
        let results = await getUserPosts(userID);

        if(results.length > 0) {
            response.json(results);
            response.status(200).end();
        } else {
            response.status(404).end();
        } 
    } else {
        response.status(400).end();
    }
}


// this function handles the /posts/listAllPosts/ endpoint
async function listAllPosts(request, response) {
    // get all posts from the database and return them
    let results = await getAllPosts();

    if(results.length > 0) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end();
    } 
}

// this function handles the /posts/listValidPosts/ endpoint
async function listValidPosts(request, response) {
    let results = await getValidPosts();
    if(results != null) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end();
    }
}

module.exports = {listAllPosts, listValidPosts, listAllUserPosts};