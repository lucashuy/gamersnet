'use strict';

let { getUserIDFromToken } = require('../../persistence/tokens');
let { updateDetails } = require('../../persistence/users');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility');

const validParameters = {
    age: 1,
    timezone: 1,
    platform: 1,
    games: 1
}

function validateParameters(body) {
    Object.keys(body).forEach((value) => {
        if (!validParameters[value]) return false;
        if (body[value].length > 32) return false;
    });

    return true;
}

async function updateDetailsCallback(request, response) {
    let cookies = request.get('Cookie');

    // if we dont have cookies, full stop
    if (!cookies) {
        response.status(401).end();
        return;
    }

    let token = cookies.split('=')[1];

    // bad parameters
    let body = request.body;
    if (!validateParameters(body)) {
        response.status(400).end();
        return;
    }

    //invalid cookie
    if (await verifyUserLoggedIn(token)) {
        let tokenDocument = await getUserIDFromToken(token);

        await updateDetails(tokenDocument.userID, body);

        response.status(204).end();
    } else {
        response.status(401).end();
    }
}

module.exports = updateDetailsCallback;