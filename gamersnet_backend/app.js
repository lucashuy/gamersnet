'use strict';

// create express object that handles all our regular endpoints
let express = require('express');
let app = express();

let users = require('./routes/users');
let posts = require('./routes/posts');
let avatar = require('./routes/avatar');

app.use(express.json());

app.use((request, response, next) => {
    // we have to set CORS to let our frontend access the backend
    // our frontend is (currently) set to port 3001 while this backend is on 3000
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    response.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use('/users', users);

// define routes
// here we have the base route, if someone went to "example.com/" they would get here
app.get('/', (request, response) => {
    let numbers = [];

    // fill array with 5 random floats
    for (let i = 0; i < 5; i++) numbers.push(Math.random());

    // return this array in a JSON object
    response.json({
        'numbers': numbers
    });
});

app.use('/posts', posts);
app.use('/avatar', avatar);

module.exports = app;
