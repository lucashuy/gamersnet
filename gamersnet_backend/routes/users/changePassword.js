'use strict';

const bcrypt = require('bcrypt');

let {getUserIDFromToken, updateUserToken, TOKEN_LIFE_SPAN} = require('../../persistence/tokens');
let {updateUserPassword, getUserByID} = require('../../persistence/users');
const alphaNumericize = require('../utilities/alphaNumericize');
let makeHash = require('../utilities/makeHash');
let {verifyUserLoggedIn} = require('../utilities/tokenUtility');

function verifyPasswordRequirements(password) {
    if (password == false) return false;

    return true;
}

async function changePassword(request, response) {
    let body = request.body;
    let cookies = request.get('Cookie');

    // check if cookie is present we have old password and new password parameters
    if (!cookies || (!verifyPasswordRequirements(body.oldPassword) && !verifyPasswordRequirements(body.newPassword))) {
        response.status(400).end();

        return;
    }
        
    let token = cookies.split('=')[1];
    let isValid = await verifyUserLoggedIn(token);

    if (isValid) {
        // get the token document of this user
        let tokenDocument = await getUserIDFromToken(token);
        let userID = tokenDocument.userID;

        // get the user document to validate old password
        let userDocument = await getUserByID(userID);
        let correctPassword = await bcrypt.compare(body.oldPassword, userDocument.password).then((correct) => {return correct});

        if (!correctPassword) {
            response.status(401).end();

            return;
        }

        // make new password hash
        let hashPassword = await makeHash(body.newPassword);

        await updateUserPassword(userID, hashPassword);

        let newToken = await makeHash(userID);
        let alphaNumericToken = alphaNumericize(newToken);

        await updateUserToken(userID, alphaNumericToken);

        response.cookie('token', alphaNumericToken, {maxAge: TOKEN_LIFE_SPAN, httpOnly: false});
        response.status(204).end();

        return;
    }

    response.status(401).end();
}

module.exports = changePassword;