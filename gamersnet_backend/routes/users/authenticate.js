'use strict';

let bcrypt = require('bcrypt');

let {TOKEN_LIFE_SPAN, updateUserToken} = require('../../persistence/tokens');
let {getUserByUsername} = require('../../persistence/users');
let alphaNumericize = require('../utilities/alphaNumericize');
let makeHash = require('../utilities/makeHash');

function verifyUsernameRequirements(username) {
    if (username == false) return false;

    return true;
}

function verifyPasswordRequirements(password) {
    if (password == false) return false;

    return true;
}

async function authenticate(request, response) {
    let body = request.body;

    // validate if username and password exist
    let validUsername = verifyUsernameRequirements(body.username);
    let validPassword = verifyPasswordRequirements(body.password);

    if (validUsername && validPassword) {
        // search db for document containing username
        let result = await getUserByUsername(body.username)
        let correctPassword = false;

        // additionally check if the given password matches the database hash
        if (result) await bcrypt.compare(body.password, result.password).then((correct) => correctPassword = correct);

        if (correctPassword) {
            // make a new token and update it
            let tokenNew = await makeHash(result._id);
            await updateUserToken(result._id, tokenNew);

            // give client token
            response.cookie('token', alphaNumericize(tokenNew), {maxAge: TOKEN_LIFE_SPAN, httpOnly: false});
            response.status(204).end();
        } else {
            response.status(401).end();
        }
    } else {
        response.status(401).end();
    }
}

module.exports = authenticate;
