'use strict';

let {getUserByID} = require('../../persistence/users');

function buildResponse(userDocument) {
    let jsonResponse = {
        connected: 0,
        username: userDocument.username,
        details: {
            age: '',
            timezone: '',
            platform: '',
            games: ''
        }
    };

    if (userDocument.details) {
        Object.keys(userDocument.details).forEach((key) => {
            jsonResponse.details[key] = userDocument.details[key];
        });
    }

    return jsonResponse;
}

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
        let json = buildResponse(result);

        response.status(200).end(JSON.stringify(json));
    }
}

module.exports = getUserDetails;