let {getUserByID} = require('../../persistence/users');

async function getUsername(request, response) {
    let id = request.params.id
    let result = null;

    // for some reason, an invalid id parameter will be the string "undefined"
    if (id !== 'undefined') {
        result = await getUserByID(id);
    }
    
    if (result === null) {
        response.status(404).end();
    } else {
        response.status(200).end(JSON.stringify({username: result.username}));
    }
}

module.exports = getUsername;