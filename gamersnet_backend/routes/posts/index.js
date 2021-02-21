const router = require('express').Router();

// include each route handler
let createPost = require('./createPost');
let getAllPosts = require('./getAllPosts');

// specify the routes under /posts/ and pass them off to each function
router.get('/', (req, res) => {//check http://localhost:3000/posts to see it working
    res.json({
        '/posts': 'Working!'
    });
});
router.post('/createPost', createPost);
router.get('/getPosts', getAllPosts);

// return the above routes
module.exports = router;