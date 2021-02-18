'use strict';

// include our function from the database to add user
let {addUser} = require('../../persistence/users');

// this function handles the /user/createAccount/ endpoint
async function createAccount(request, response) {
    // make random number for username
    let result = await addUser(Math.random() * Math.floor(100));

    response.json(result);
}

module.exports = createAccount;