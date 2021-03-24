'use strict';

require('dotenv').config();

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

var webSocketServer = require('ws').Server;
var socket = new webSocketServer({"server": server});
let {webSocketOnConnect} = require('./websockets/websocket');

socket.on('connection', function(ws){
    webSocketOnConnect(ws)
});