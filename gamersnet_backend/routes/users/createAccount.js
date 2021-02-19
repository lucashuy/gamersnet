'use strict';

let bcrypt = require('bcrypt');
let {addUser, getUserByUsername} = require('../../persistence/users');

function verifyUsernameRequirements(username) {
    if (username == false) return false;

    return true;
}

async function verifyUsernameUnused(username) {
    let result = await getUserByUsername(username);
    
    return result === null;
}

function verifyPasswordRequirements(password) {
    if (password == false) return false;

    return true;
}

async function createAccount(request, response) {
    let body = request.body;

    let validUsername = verifyUsernameRequirements(body.username);
    let usernameNotUsed = await verifyUsernameUnused(body.username);
    let validPassword = verifyPasswordRequirements(body.password);

    if (validUsername && usernameNotUsed && validPassword) {
        await bcrypt.hash(body.password, 10, async (error, hash) => {
            if (error) {
                response.status(500).end();
            } else {
                await addUser(body.username, hash);

                response.status(200).json({status: 'good'});
            }
        });
    } else {
        response.status(400).end();
    }
}

module.exports = createAccount;