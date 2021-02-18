let app = require('express').Router();

// include each route handler
let createAccount = require('./createAccount');
let getAllUsers = require('./getAllUsers');

// specify the routes under /users/ and pass them off to each function
app.post('/createAccount', createAccount)
app.post('/getAllUsers', getAllUsers)

// return the above routes
module.exports = app;