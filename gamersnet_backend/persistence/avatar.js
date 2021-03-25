'use strict';

let ObjectID = require('mongodb').ObjectId;
let MongoDB = require('./mongodb');
let db, avatar;

async function connect() {
    db = await MongoDB.open();

    avatar = db.collection('avatar');
}

async function upsertAvatar(id, imageBuffer, mimeType) {
    await connect();

    let result = avatar.updateOne(
        {userID: id},
        {
            $set: {
                userID: id,
                contentType: mimeType,
                avatar: imageBuffer
            }
        },
        {upsert: true}
    );

    return result;
}

async function getAvatarByUserID(userID) {
    await connect();

    let result = avatar.findOne({userID: new ObjectID(userID)});
    return result;
}

module.exports = {upsertAvatar, getAvatarByUserID};