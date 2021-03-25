'use strict';

let {getInteractions} = require('../../persistence/messages');

let {verifyUserLoggedIn} = require('../utilities/tokenUtility');

let {getUserIDFromToken} = require('../../persistence/tokens.js');
const { getUserByID } = require('../../persistence/users');

async function listInteractedIDs(request, response) {
    let cookie = request.headers.cookie;
    let loggedIn = false;

    if (cookie) {
        cookie = cookie.split('=')[1];
        loggedIn = await verifyUserLoggedIn(cookie);
    }
    let tokenDocument = await getUserIDFromToken(cookie);

    //get logged in user id from token
    let loggedUserID = tokenDocument.userID;
    if (loggedIn) {
        let listInteractions = await getInteractions(loggedUserID);

        if(listInteractions.length > 0) {
            let listInteractedUsers = await extractInteractedUsers(listInteractions, loggedUserID);
            response.json({users: listInteractedUsers});
            response.status(200).end();
        } else {
            response.status(404).send("No messages found");
        }

    } else {
        if (!loggedIn) {
            response.status(401).send("User not logged in");
        } else{
            response.status(400).end("Please try again later"); //bad request
        }           
    }
}

//get the people the user interacted with from list of it's interactions
async function extractInteractedUsers(interactions, userID) {
    let users = [];
    let localID;

    for (let chat of interactions) {
        if (chat.sender.equals(userID)) {
            localID = chat.receiver;
        } else if (chat.receiver.equals(userID)) {
            localID = chat.sender;
        }

        if (!listIncludesObjectID(users, localID)) {
            let userDocument = await getUserByID(localID);
    
            users.push({
                id: localID,
                username: await userDocument.username
            });
        }
    }

    return users;
}


//this is a bad way to remove duplicates, feel free to improve it
function listIncludesObjectID(list, id) {
    for (let obj of list) {
        if (obj.id.equals(id)) return true;
    }

    return false;
}

module.exports = {listInteractedIDs};