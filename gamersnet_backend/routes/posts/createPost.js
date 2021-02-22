'use strict';

// include our function from the database to add post
let {addPost} = require('../../persistence/posts');

// this function handles the /post/createPost/ endpoint
async function createPost(request, response) {
    let body = request.body
    
    await addPost(body.userId, body.description, body.gameName, body.numPlayers, body.gameTime, body.duration, body.location);

    response.status(204).end();
}

module.exports = createPost;