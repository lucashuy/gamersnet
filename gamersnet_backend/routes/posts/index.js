const router = require('express').Router();

// include each route handler
let { removePost } = require('./deletePost');
let {createPost} = require('./createPost');
let {listAllPosts, listValidPosts} = require('./getPosts');

router.post('/createPost', createPost);
router.get('/listAllPosts', listAllPosts);
router.get('/listValidPosts', listValidPosts);
router.delete('/deletePost', removePost);

// return the above routes
module.exports = router;
