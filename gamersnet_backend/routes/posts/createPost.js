'use strict';

// include our function from the database to add post
let {addPost} = require('../../persistence/posts');
let {getUserByUsername} = require('../../persistence/users')

//to only let existing users to create post, not guests
async function verifyUserExists(username) {
    if(username) {
        let result = await getUserByUsername(username);
        return result != null;
    }
    return false;
}

// this function handles the /post/createPost/ endpoint
async function createPost(request, response) {
    let body = request.body
    let userExists = await verifyUserExists(body.username);
    
    if(userExists && body.description && body.gameTimeUTC && body.gameName) {
        await addPost(body.username, body.description, body.gameName, body.numPlayers, body.gameTimeUTC, body.duration, body.location);
        response.status(204).end();
    } else {
        response.status(400).end();
    }
    
}

module.exports = createPost;
