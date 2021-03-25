'use strict';

let fs = require('fs');

let {getUserByID} = require('../../persistence/users');
let {getAvatarByUserID} = require('../../persistence/avatar');

async function getAvatar(request, response) {
    let id = request.params.id
    let userDocument = null;

    // for some reason, an invalid id parameter will be the string "undefined"
    if (id !== 'undefined') {
        userDocument = await getUserByID(id);
    }
    
    if (userDocument === null) {
        response.status(404).end();
    } else {
        let avatarDocument = await getAvatarByUserID(id);

        let image;
        let contentType;

        if (avatarDocument === null) {
            image = fs.readFileSync(`${__dirname}/defaultAvatar.png`);
            contentType = 'image/png';
        } else {
            image = avatarDocument.avatar.buffer;
            contentType = avatarDocument.contentType;
        }

        response.contentType(contentType);
        response.write(image);

        response.status(200).end();
    }
}

module.exports = getAvatar;