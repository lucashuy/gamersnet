'use strict';

let MongoDB = require('./mongodb');

//assuming posts expire if the gametime is older than current time
//so get posts for games scheduled today or in future
async function findCookie(cookie, userId) {
    let db = await MongoDB.open();

    let tokens = db.collection('tokens');

    let result = await tokens.find({ token: cookie, userID: userId});

    return result.toArray();
}

// make these two functions "public" to the rest of the project
module.exports = { findCookie };