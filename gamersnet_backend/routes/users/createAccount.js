'use strict';

let {addUserToken, TOKEN_LIFE_SPAN} = require('../../persistence/tokens');
let {addUser, getUserByUsername} = require('../../persistence/users');
let alphaNumericize = require('../utilities/alphaNumericize');
let makeHash = require('../utilities/makeHash');

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

    // use helper functions to check if parameters are valid
    let validUsername = verifyUsernameRequirements(body.username);
    let usernameNotUsed = await verifyUsernameUnused(body.username);
    let validPassword = verifyPasswordRequirements(body.password);

    if (validUsername && usernameNotUsed && validPassword) {
        // hash password
        let hashedPassword = await makeHash(body.password);

        // add new account to database and get the unique id of inserted account
        let result = await addUser(body.username, hashedPassword);
        let id = result.insertedId;

        let token = await makeHash(id);
        let alphaNumericToken = alphaNumericize(token);

        await addUserToken(id, alphaNumericToken);


        // send the client said token
        response.cookie('token', alphaNumericToken, {maxAge: TOKEN_LIFE_SPAN, httpOnly: false});
        response.status(204).end();
    } else {
        response.status(400).end();
    }
}

module.exports = createAccount;