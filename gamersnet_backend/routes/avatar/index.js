const router = require('express').Router();
const multer = require('multer');
let upload = multer();

let changeAvatar = require('./changeAvatar');

router.post('/changeAvatar', upload.single('image'), changeAvatar);

// return the above routes
module.exports = router;