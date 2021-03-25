'use strict';

let {getMessagesBetweenUsers} = require('../../persistence/messages');

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

        let chat1 = await getMessagesBetweenUsers(userID1, userID2);
        let chat2 = await getMessagesBetweenUsers(userID2, userID1);


        let chat = chat1.concat(chat2);
        
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