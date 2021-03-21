'use strict';

let {verifyUserLoggedIn} = require('../utilities/tokenUtility');

const validParameters = {
    age: 1,
    timezone: 1,
    platform: 1,
    games: 1
}

async function updateDetails(request, response) {
    let cookies = request.get('Cookie');

    // if we dont have cookies, full stop
    if (!cookies) {
        response.status(400).end();

        return;
    }

    let validRequest = false;
    let token = cookies.split('=')[1];
    
    let body = request.body;

    // invalid cookie
    if (await verifyUserLoggedIn(token)) {
        validRequest = true;
    }

    if (validRequest) {
        response.status(204).end();
    } else {
        response.status(400).end();
    }
}

module.exports = updateDetails;