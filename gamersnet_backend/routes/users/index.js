let app = require('express').Router();

// include each route handler
let createAccount = require('./createAccount');
let authenticate = require('./authenticate');
let changePassword = require('./changePassword');

app.post('/createAccount', createAccount)
app.post('/changePassword', changePassword)
app.post('/authenticate', authenticate)

// return the above routes
module.exports = app;