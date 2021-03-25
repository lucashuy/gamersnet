const router = require('express').Router();

let {listChatMessages} = require('./getMessages');
let {newMessage} = require('./addMessage');
let {listInteractedIDs} = require('./getInteractions');

router.post('/addMessage', newMessage);
router.get('/listChatMessages', listChatMessages);
router.get('/listInteractedIDs', listInteractedIDs);


// return the above routes
module.exports = router;