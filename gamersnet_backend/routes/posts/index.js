const router = require('express').Router();

// include each route handler
let createPost = require('./createPost');
let {listAllPosts, listValidPosts} = require('./getPosts');

// specify the routes under /posts/ and pass them off to each function
// check http://localhost:3000/posts to see it working
router.get('/', (req, res) => {
    res.json({
        '/posts': 'Working!'
    });
});

router.post('/createPost', createPost);
router.get('/listAllPosts', listAllPosts);
router.get('/listValidPosts', listValidPosts);

// return the above routes
module.exports = router;
