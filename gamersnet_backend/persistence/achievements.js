'use strict';

let MongoDB = require('./mongodb');

let db, achievements;

async function connect() {
    if (!db) db = await MongoDB.open();

    achievements = db.collection('achievements');
}

async function getAchievementsDB() {
    await connect();

    let returnObj = {};
    let result = achievements.find({});

    for (let obj of await result.toArray()) {
        returnObj[obj.nameInternal] = obj;
    }

    return returnObj;
}

module.exports = {getAchievementsDB};