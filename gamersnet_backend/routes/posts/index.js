const router = require('express').Router();

// include each route handler
let {createPost} = require('./createPost');
let {listAllPosts, listValidPosts, listUserPosts} = require('./getPosts');

router.post('/createPost', createPost);
router.get('/listAllPosts', listAllPosts);
router.get('/listValidPosts', listValidPosts);
router.post('/listUserPosts', listUserPosts);



// return the above routes
module.exports = router;
