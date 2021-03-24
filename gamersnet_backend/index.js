'use strict';

require('dotenv').config();
let registerTimer = require('./registerTimer');
let updateAgeAchievement = require('./repeatingEvents/accountAgeAchievement');
let postsAchievements = require('./repeatingEvents/postsAchievements');


if ((process.env.PORT === undefined || process.env.MONGODB_HOST === undefined) && process.env.NODE_ENV !== 'memory') {
    console.log('Misconfigured .env file, stopping.');
    process.exit(1);
}

const MongoDB = require('./persistence/mongodb')

// include main express object
let app = require('./app');

// define the backend server object and bind all HTTP requests to our express object
let server = require('http').createServer();
server.on('request', app);

let port = process.env.PORT || 3000;

// start server using port in .env file
server.listen(port, async () => {
    console.log(`Backend ready on port ${port}.`);

    await MongoDB.open();
});

registerTimer(updateAgeAchievement, 60);
registerTimer(postsAchievements, 5);