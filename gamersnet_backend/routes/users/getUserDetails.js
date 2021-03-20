'use strict';

let {getUserByID} = require('../../persistence/users');

async function getUserDetails(request, response) {
    let id = request.params.id
    let result = null;

    // for some reason, an invalid id parameter will be the string "undefined"
    if (id !== 'undefined') {
        result = await getUserByID(id);
    }
    
    if (result === null) {
        response.status(404).end();
    } else {
        let jsonResponse = {
            connected: 0,
            username: result.username
        }

        response.status(200).end(JSON.stringify(jsonResponse));
    }
}

module.exports = getUserDetails;