'use strict';

let {upsertAvatar} = require('../../persistence/avatar');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility');
let {getUserIDFromToken} = require('../../persistence/tokens');

let imageSize = require('image-size');

async function updateAvatar(request, response) {
    let cookies = request.get('Cookie');

    // if we dont have cookies, full stop
    if (!cookies) {
        response.status(400).end();

        return;
    }

    let validImage = false;
    let token = cookies.split('=')[1];

    // invalid cookie
    if (await verifyUserLoggedIn(token)) {
        if (request.file && request.file.mimetype.includes('image')) {
            let size = imageSize(request.file.buffer);
    
            if (size.height <= 256 && size.width <= 256) {
                let tokenDocument = await getUserIDFromToken(token);
                let userID = tokenDocument.userID;
                
                await upsertAvatar(userID, request.file.buffer, request.file.mimetype);
                validImage = true;
            }
        }
    }

    if (validImage) {
        response.status(204).end();
    } else {
        response.status(400).end();
    }
}

module.exports = updateAvatar;