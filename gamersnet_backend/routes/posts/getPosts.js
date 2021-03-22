'use strict';


// include our function from the database to add post
let {getPost, getAllPosts, getValidPosts} = require('../../persistence/posts');

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

//list of posts that hasn't expired yet(the scheduled game time > current time)
async function listValidPosts(request, response) {
    let results = await getValidPosts();
    if(results.length > 0) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end();
    }
}

//search for post with the given id
async function getPostbyID(request, response) {
    let _id = request.query._id
    let results = await getPost(_id);
    if(results != null) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end();
    }
}

module.exports = {listAllPosts, listValidPosts, getPostbyID};