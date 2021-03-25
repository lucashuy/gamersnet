'use strict';

let {getInteractions} = require('../../persistence/messages');

let {verifyUserLoggedIn} = require('../utilities/tokenUtility');

async function listInteractedIDs(request, response) {
    console.log("listInteractedIDs")

    let cookie = request.headers.cookie;
    let userID = request.query.userID;
    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }

    if (loggedIn) {

        let listInteractions = await getInteractions(userID);
        console.log(listInteractions)

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

    console.log(userID)
    console.log(interactions)
    for(i = 0; i < interactions.length; i++) {
        console.log(interactions[i].receiver)
        if(!interactions[i].sender.equals(userID)  && !listIncludesObjectID(users, interactions[i].sender)) {
            console.log(users.includes(interactions[i].sender))
            users.push(interactions[i].sender);
        }
        else if(!interactions[i].receiver.equals(userID)  && !listIncludesObjectID(users, interactions[i].receiver)) {// dont' add duplicates
            users.push(interactions[i].receiver);
        }
    }
    return users;
}


//this is a bad way to remove duplicates, feel free to improve it
function listIncludesObjectID(list, id) {
    let i;
    for(i = 0; i < list.length; i++) {
        if(list[i].equals(id)) {
            return true;
        }
    }
    return false;
}

module.exports = {listInteractedIDs};