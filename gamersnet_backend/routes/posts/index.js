const router = require('express').Router();

// include each route handler
let { removePost } = require('./deletePost');
let {createPost} = require('./createPost');
let {listAllPosts, listValidPosts, listUserPosts, getPostbyID} = require('./getPosts');
let {updatePost} = require('./updatePost')


router.post('/createPost', createPost);
router.get('/listAllPosts', listAllPosts);
router.get('/listValidPosts', listValidPosts);
router.delete('/deletePost', removePost);
router.get('/listUserPosts', listUserPosts);

router.get('/getPostbyID', getPostbyID);
router.post('/updatePost', updatePost);

//test routes
// let {updatePostUnauthorized} = require('./updatePost')
// router.post('/updatePostUnauthorized', updatePostUnauthorized);


// return the above routes
module.exports = router;
