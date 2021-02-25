'use strict';

// include our function from the database to verify token
let {tokenValid} = require('../../persistence/tokens');


async function verifyUserLoggedIn( cookie) {
    let found = await tokenValid(cookie);
    
    return found.length > 0;
}

// make these functions "public" to the rest of the project
module.exports = { verifyUserLoggedIn };