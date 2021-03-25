let app = require('express').Router();
const multer = require('multer');
let upload = multer();

let createAccount = require('./createAccount');
let authenticate = require('./authenticate');
let updatePassword = require('./updatePassword');
let updateAvatar = require('../users/updateAvatar');
let getAvatar = require('../users/getAvatar');
let getUserDetails = require('./getUserDetails');
let updateDetailsCallback = require('./updateDetails');
let getAchievements = require('./getAchievements');

app.post('/createAccount', createAccount)
app.post('/authenticate', authenticate)

app.get('/getAvatar/:id', getAvatar);
app.get('/getUserDetails/:id', getUserDetails);
app.get('/getAchievements/:id', getAchievements);

app.patch('/updatePassword', updatePassword)
app.patch('/updateAvatar', upload.single('image'), updateAvatar);
app.patch('/updateDetails', updateDetailsCallback);

// return the above routes
module.exports = app;