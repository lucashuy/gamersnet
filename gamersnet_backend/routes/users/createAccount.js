'use strict';

let {addUser} = require('../../persistence/users');

async function createAccount(request, response) {
    let result = await addUser(Math.random() * Math.floor(100));

    response.json(result);
}

module.exports = createAccount;