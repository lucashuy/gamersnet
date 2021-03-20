const router = require('express').Router();

// include each route handler
let {createPost} = require('./createPost');
let {listAllPosts, listValidPosts, listAllUserPosts} = require('./getPosts');

router.post('/createPost', createPost);
router.get('/listAllPosts', listAllPosts);
router.get('/listValidPosts', listValidPosts);
router.get('/listUserPosts', listAllUserPosts);



// return the above routes
module.exports = router;
