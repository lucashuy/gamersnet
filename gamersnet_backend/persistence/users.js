'use strict';

let ObjectID = require('mongodb').ObjectId;
let MongoDB = require('./mongodb');
let db, users;

async function connect() {
    // connect wait for server to connect to db
    db = await MongoDB.open();

    // once it connected, get the "users" collection (aka a table in SQL)
    users = db.collection('users');
}

async function getUserByID(id) {
    await connect();

    let result = users.findOne({_id: new ObjectID(id)});
    return result;
}

async function getUserByUsername(username) {
    await connect();

    let result = users.findOne({username: username});
    return result;
}

async function addUser(username, hashedPassword) {
    await connect();

    return await users.insertOne({
        username: username,
        password: hashedPassword,
        achievements: [],
        creationDate: Date.now()
    });
}

async function updateUserPassword(id, hashedPassword) {
    await connect();
    
    return await users.findOneAndUpdate(
        {_id: id},
        {
            $set: {
                password: hashedPassword
            }
        }
    );
}

async function updateDetails(id, details) {
    await connect();
    
    return await users.findOneAndUpdate(
        {_id: id},
        {
            $set: {
                details: details
            }
        }
    );
}

async function addAchievementByUserID(userID, achieveID) {
    await connect();

    return await users.findOneAndUpdate(
        {_id: new ObjectID(userID)},
        {
            $addToSet: {
                achievements: new ObjectID(achieveID)
            }
        }
    )
}

async function updateRankByUserID(id, rankInfo) {
    await connect();
    
    return await users.findOneAndUpdate(
        {_id: id},
        {
            $set: {
                rankDetail: {
                    game: rankInfo.game,
                    rank: rankInfo.rank
                }
            }
        }
    );
}

module.exports = {
    addUser,
    getUserByUsername,
    updateUserPassword,
    getUserByID,
    updateDetails,
    addAchievementByUserID,
    updateRankByUserID
};