'use strict';

// include our function from the database to add post
let {addPost} = require('../../persistence/posts');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility')

let {getTokenDocument} = require('../../persistence/tokens.js')

// this function handles the /post/createPost/ endpoint
async function createPost(request, response) {
    let body = request.body;
    let cookie = request.headers.cookie;
    let verifyBody = body.description && body.gameTimeUTC && body.gameName 
                        && body.description.length>0 &&  body.gameTimeUTC.length>0 && body.gameName.length>0

    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }

    if (loggedIn && verifyBody) {
        let tokenDocument = await getTokenDocument(cookie);

        //input type are verified here
        let userID = tokenDocument.userID;
        let numPlayers = parseInt(body.numPlayers);
        let gameTimeUTC = new Date(body.gameTimeUTC);

        await addPost(userID, body.description, body.gameName, numPlayers, gameTimeUTC, body.duration, body.location);
        response.status(201).end();
    } else {
        if(!loggedIn){
            response.status(401).end();//unauthorized
        }   
        else{
            response.status(400).end(); //bad request
        }           
    }
}

module.exports = {createPost};