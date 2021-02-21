'use strict';

let bcrypt = require('bcrypt');

let {addUserToken, TOKEN_LIFE_SPAN} = require('../../persistence/tokens');
let {addUser, getUserByUsername} = require('../../persistence/users');
let generateToken = require('./generateToken');

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
        await bcrypt.hash(body.password, 10, async (error, passwordHash) => {
            let result = await addUser(body.username, passwordHash);
            let id = result.insertedId;
            
            let token = await generateToken(id);
            await addUserToken(id, token);

            response.cookie('token', token, {maxAge: TOKEN_LIFE_SPAN, httpOnly: true});
            response.status(204).end();
        });
    } else {
        response.status(400).end();
    }
}

module.exports = createAccount;