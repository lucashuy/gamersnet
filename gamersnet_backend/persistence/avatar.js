'use strict';

let MongoDB = require('./mongodb');
let db, avatar;

async function connect() {
    db = await MongoDB.open();

    avatar = db.collection('avatar');
}

async function upsertAvatar(id, image) {
    await connect();

    let result = avatar.update(
        {userID: id},
        {
            userID: id,
            avatar: image
        },
        {upsert: true}
    );

    return result;
}

module.exports = upsertAvatar;