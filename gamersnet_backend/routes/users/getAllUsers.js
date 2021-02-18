'use strict';

let {getUsers} = require('../../persistence/users');

async function getAllUsers(request, response) {
    let results = await getUsers();
    response.json(results);
}

module.exports = getAllUsers;