'use strict';

const PORT = 3000;

// create express object that handles all our regular endpoints
let express = require('express');
let app = express();

// define the backend server object and bind all HTTP requests to our express object
let server = require('http').createServer();
server.on('request', app);

// define routes
app.get('/', (request, response) => {
    response.send('this is the home page');
});

app.get('/page1', (request, response) => {
    response.send('this is page one, but in plain text');
});

app.get('/page2', (request, response) => {
    response.json({
        'str1': 'this is page2',
        'str2': 'but this time in json'
    });
});

// define 404 for nonexistant endpoints
app.use((request, response, next) => {
    response.status(404).send();
})

// start server
server.listen(PORT, () => {});