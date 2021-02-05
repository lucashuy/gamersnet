'use strict';

// include main express object
let app = require('./app');

// define the backend server object and bind all HTTP requests to our express object
let server = require('http').createServer();
server.on('request', app);

// start server using port in .env file
server.listen(process.env.PORT, () => {});
