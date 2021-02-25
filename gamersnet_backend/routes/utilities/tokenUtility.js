'use strict';

// include our function from the database to verify token
let {tokenValid} = require('../../persistence/tokens');


async function verifyUserLoggedIn( cookie, userId) {
    let found = await tokenValid(cookie, userId);
    
    return found.length > 0;
}

// make these functions "public" to the rest of the project
module.exports = { verifyUserLoggedIn };