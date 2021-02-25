'use strict';


// include our function from the database to add post
let {getAllPosts, getValidPosts} = require('../../persistence/posts');

// this function handles the /post/getAllPosts/ endpoint
async function listAllPosts(request, response) {
    // get all posts from the database and return them
    let results = await getAllPosts();

    if(results.length > 0) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end();
    } 
}

async function listValidPosts(request, response) {
    let results = await getValidPosts();
    if(results != null) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end();
    }
}

module.exports = {listAllPosts, listValidPosts};