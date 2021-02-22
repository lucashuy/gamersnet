'use strict';

let bcrypt = require('bcrypt');

let {TOKEN_LIFE_SPAN, updateUserToken} = require('../../persistence/tokens');
let {getUserByUsername} = require('../../persistence/users');
let generateToken = require('./generateToken');

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

    let validUsername = verifyUsernameRequirements(body.username);
    let validPassword = verifyPasswordRequirements(body.password);

    if (validUsername && validPassword) {
        let result = await getUserByUsername(body.username)
        let correctPassword = false;

        if (result) await bcrypt.compare(body.password, result.password).then((correct) => correctPassword = correct);

        if (correctPassword) {
            let tokenNew = await generateToken(result._id);

            await updateUserToken(result._id, tokenNew);

            response.cookie('token', tokenNew, {maxAge: TOKEN_LIFE_SPAN, httpOnly: true});
            response.status(204).end();
        } else {
            response.status(400).end();
        }
    } else {
        response.status(400).end();
    }
}

module.exports = authenticate;