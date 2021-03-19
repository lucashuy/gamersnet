const router = require('express').Router();

// include each route handler
let {createPost} = require('./createPost');
let {listAllPosts, listValidPosts, getPostbyID} = require('./getPosts');

router.post('/createPost', createPost);
router.get('/listAllPosts', listAllPosts);
router.get('/listValidPosts', listValidPosts);
router.get('/getPostbyID', getPostbyID);


// return the above routes
module.exports = router;
