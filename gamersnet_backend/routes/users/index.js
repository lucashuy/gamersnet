let app = require('express').Router();

let createAccount = require('./createAccount');
let getAllUsers = require('./getAllUsers');

app.post('/createAccount', createAccount)
app.post('/getAllUsers', getAllUsers)

module.exports = app;