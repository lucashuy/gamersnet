'use strict';

let {getInteractions} = require('../../persistence/messages');

let {verifyUserLoggedIn} = require('../utilities/tokenUtility');

async function listInteractedIDs(request, response) {

    let cookie = request.headers.cookie;
    let userID = request.query.userID;
    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }

    if (loggedIn) {

        let listInteractions = await getInteractions(userID);

        if(listInteractions.length > 0) {
            let listInteractedUsers = extractInteractedUsers(listInteractions, userID);
            response.json({interactedIDs: listInteractedUsers});
            response.status(200).end();
        } else {
            response.status(401).send("No messages found");
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

//get the people the user interacted with from list of it's interactions
function extractInteractedUsers(interactions, userID) {
    let users = [];
    let i =0;
    for(i = 0; i < interactions.length; i++) {
        if(!interactions[i]['sender'].equals(userID)  && !users.includes(interactions[i]['sender'])) {
            users.push(interactions[i]['sender']);
        }
        else if(!interactions[i]['receiver'].equals(userID)  && !users.includes(interactions[i]['receiver'])) {// dont' add duplicates
            users.push(interactions[i]['receiver']);
        }
    }
    return users;
}

module.exports = {listInteractedIDs};