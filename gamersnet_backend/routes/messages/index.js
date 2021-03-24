const router = require('express').Router();

let {listChatMessages} = require('./getMessages');
let {newMessage} = require('./addMessage');

router.post('/addMessage', newMessage);
router.get('/listChatMessages', listChatMessages);


// return the above routes
module.exports = router;