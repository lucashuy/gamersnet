'use strict';

const {getUserPosts} = require("../../persistence/posts");
const {getUserByID, addAchievementByUserID} = require("../../persistence/users");
const {getAchievementsDB} = require('../../persistence/achievements');

let achievements;

async function addAchievementHelper(toSend, userID, achieve) {
    // add to return result
    toSend.push(achieve);

    // add achievement in database
    await addAchievementByUserID(userID, achieve._id);
}

async function getAchievements(request, response) {
    let id = request.params.id
    
    // if id is not included
    if (id == 'undefined') {
        response.status(404).end();
        return;
    }
    
    // if the user does not exist
    let userDocument = await getUserByID(id);
    if (await userDocument === null) {
        response.status(404).end();
        return;
    }

    let toSend = [];

    // load achievements locally
    achievements = await getAchievementsDB();

    // update post achievements
    let results = await getUserPosts(id);
    let numPosts = results.length;

    if (numPosts >= 1) addAchievementHelper(toSend, id, achievements['POST_1']);
    if (numPosts >= 5) addAchievementHelper(toSend, id, achievements['POST_5']);
    if (numPosts >= 10) addAchievementHelper(toSend, id, achievements['POST_10']);

    // update age achievements
    addAchievementHelper(toSend, id, achievements['AGE_0']);

    if (userDocument.creationDate + (1000 * 60 * 60 * 24 * 7) <= Date.now()) {
        addAchievementHelper(toSend, id, achievements['AGE_7']);
    }

    // send to client
    response.status(200).end(JSON.stringify(
        {
            achievements: toSend
        }
    ));
}

module.exports = getAchievements;