const router = require('express').Router();

// include each route handler
let {createPost} = require('./createPost');
let {listAllPosts, listValidPosts, getPostbyID} = require('./getPosts');
let {updatePost_unauthorized} = require('./updatePost')

router.post('/createPost', createPost);
router.get('/listAllPosts', listAllPosts);
router.get('/listValidPosts', listValidPosts);
router.get('/getPostbyID', getPostbyID);
router.post('/updatePost_unauthorized', updatePost_unauthorized);


// return the above routes
module.exports = router;
