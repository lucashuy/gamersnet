'use strict';

let fs = require('fs');

let {getUserByID} = require('../../persistence/users');
let {getAvatarByUserID} = require('../../persistence/avatar');

async function getAvatar(request, response) {
    let id = request.params.id
    let result = await getUserByID(id);
    
    if (result === null) {
        response.status(404).end();
    } else {
        result = await getAvatarByUserID(id);

        let image;
        let contentType;

        if (result === null) {
            console.log(__dirname);
            image = fs.readFileSync(`${__dirname}/defaultAvatar.png`);
            contentType = 'image/png';
        } else {
            image = result.avatar.buffer;
            contentType = result.contentType;
        }

        response.contentType(contentType);
        response.write(image);

        response.status(200).end();
    }
}

module.exports = getAvatar;