'use strict';

// include our function from the database to add user
let {getUsers} = require('../../persistence/users');

// this function handles the /user/getAllUsers/ endpoint
async function getAllUsers(request, response) {
    // get all users from the database and return them
    let results = await getUsers();
    response.json(results);
}

module.exports = getAllUsers;