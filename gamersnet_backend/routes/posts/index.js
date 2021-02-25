const router = require('express').Router();

// include each route handler
let {createPost} = require('./createPost');
let {listAllPosts, listValidPosts} = require('./getPosts');

router.post('/createPost', createPost);
router.get('/listAllPosts', listAllPosts);
router.get('/listValidPosts', listValidPosts);

// return the above routes
module.exports = router;
