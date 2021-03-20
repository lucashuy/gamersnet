let app = require('express').Router();
const multer = require('multer');
let upload = multer();

let createAccount = require('./createAccount');
let authenticate = require('./authenticate');
let changePassword = require('./changePassword');

let changeAvatar = require('../users/changeAvatar');
let getAvatar = require('../users/getAvatar');

app.post('/createAccount', createAccount)
app.patch('/changePassword', changePassword)
app.post('/authenticate', authenticate)

app.patch('/changeAvatar', upload.single('image'), changeAvatar);
app.get('/getAvatar/:id', getAvatar);

// return the above routes
module.exports = app;