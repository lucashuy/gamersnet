'use strict';

// include our function from the database to add post
let {addPost} = require('../../persistence/posts');

// this function handles the /post/createPost/ endpoint
async function createPost(request, response) {
    // make random number for username
    let result = await addPost(Math.random() * Math.floor(100));

    response.json(result);
}

module.exports = createPost;