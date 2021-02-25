'use strict';

let ObjectId = require('mongodb').ObjectID;

// include our function from the database to add post
let {addPost} = require('../../persistence/posts');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility')


// this function handles the /post/createPost/ endpoint
async function createPost(request, response) {
    let body = request.body;
    let cookie = request.headers.cookie;

    let loggedIn = await verifyUserLoggedIn(cookie, body.userID);
    
    if(body.userID && loggedIn && body.description && body.gameTimeUTC && body.gameName) {

        //input type are verified here
        let userID = ObjectId(body.userID);
        let numPlayers = parseInt(body.numPlayers);
        let gameTimeUTC = new Date(body.gameTimeUTC);

        await addPost(userID, body.description, body.gameName, numPlayers, gameTimeUTC, body.duration, body.location);
        response.status(204).end();
    } else {
        response.status(400).end();
    }
    
}

async function testCookie(request, response) {
    let body = request.body;
    let cookie = request.headers.cookie;

    let loggedIn = await verifyUserLoggedIn('e3db2b14396953cb10607c2c36fbdfee',ObjectId('6036d930b3e9df063ee517d4'));
    
    if(loggedIn) {
        response.status(200).end();
    } else {
        response.status(404).end();
    }
    
}

module.exports = {createPost, testCookie};
