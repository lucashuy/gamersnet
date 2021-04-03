'use strict';


// include our function from the database to fetch ratings
let {getUserRatingsDB} = require('../../persistence/ratings');

const { ObjectID } = require('bson');

// this function handles the /ratings/getUserRatings/ endpoint
async function getUserRatings(request, response) {
    //user doesn't need to be logged in to view user ratings
    let userID = request.query.userID;
    let results = await getUserRatingsDB(ObjectID(userID));
    if(results.length > 0) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end();
    }
}

// async function getUserAvgRatings(request, response) { =

// }


module.exports = {getUserRatings};
