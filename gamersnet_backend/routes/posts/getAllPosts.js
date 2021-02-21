'use strict';

// include our function from the database to add post
let {getPosts} = require('../../persistence/posts');

// this function handles the /post/getAllPosts/ endpoint
async function getAllPosts(request, response) {
    // get all posts from the database and return them
    let results = await getPosts();
    response.json(results);
}

module.exports = getAllPosts;