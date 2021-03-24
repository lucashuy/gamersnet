'use strict';

let {getChatBetweenUsers} = require('../../persistence/messages');

let {verifyUserLoggedIn} = require('../utilities/tokenUtility');

async function listChatMessages(request, response) {

    let cookie = request.headers.cookie;
    let userID1 = request.query.userID1;
    let userID2 = request.query.userID2;

    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }

    if (loggedIn) {

        let chat = await getChatBetweenUsers(userID1, userID2);
        console.log(chat);
        
        if(chat.length > 0) {
            response.json(chat);
            response.status(201).end();
        } else {
            response.status(404).send("No messages found");
        }

    } else {
        if(!loggedIn){
            response.status(401).send("User not logged in");
        }   
        else{
            response.status(400).end("Please try again later"); //bad request
        }           
    }
}

module.exports = {listChatMessages};