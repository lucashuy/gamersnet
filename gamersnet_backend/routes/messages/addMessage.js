'use strict';

// include our function from the database to add post
let {addMessage} = require('../../persistence/messages');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility')

let {getUserIDFromToken} = require('../../persistence/tokens.js')

async function newMessage(request, response) {

    let body = request.body;
    let cookie = request.headers.cookie;

    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }

    if (loggedIn && body) {
        let tokenDocument = await getUserIDFromToken(cookie);

        let sender = tokenDocument.userID;
        let message = body.message;
        let receiver = body.receiver;
        let timestamp = body.timestamp;    

        await addMessage(sender, receiver, message, timestamp);
        response.status(201).end();
    } else {
        if(!loggedIn){
            response.status(401).send("User not logged in");
        }   
        else{
            response.status(400).end("Please try again later"); //bad request
        }           
    }
}

module.exports = {newMessage};