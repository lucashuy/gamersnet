'use strict';

let { getTokenDocument } = require('../../persistence/tokens');
let { updateRankByUserID } = require('../../persistence/users');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility');

async function updateRank(request, response) {
    let cookies = request.get('Cookie');

    // if we dont have cookies, full stop
    if (!cookies) {
        response.status(401).end();
        return;
    }

    let token = cookies.split('=')[1];
    let body = request.body;

    // need to check for
    // 1. missing params
    // 2. empty game, but filled rank
    // 3. filled game, but empty rank
    console.log(body);
    if (
        (body.game === undefined || body.rank === undefined)
        || (body.game === '' && body.rank !== '')
        || (body.game !== '' && body.rank === '')
    ) {
        console.log('bad');
        response.status(400).end();
        return;
    }

    //invalid cookie
    if (await verifyUserLoggedIn(token)) {
        let tokenDocument = await getTokenDocument(token);

        await updateRankByUserID(tokenDocument.userID, body);

        response.status(204).end();
    } else {
        response.status(401).end();
    }
}

module.exports = updateRank;