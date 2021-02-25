'use strict';

let {getUserIDFromToken, updateUserToken, TOKEN_LIFE_SPAN} = require('../../persistence/tokens');
let {updateUserPassword} = require('../../persistence/users');
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

    if (!cookies || !verifyPasswordRequirements(body.password)) {
        response.status(400).end();

        return;
    }
        
    let token = cookies.split('=')[1];
    let isValid = await verifyUserLoggedIn(token);

    if (isValid) {
        let hashPassword = await makeHash(body.password);

        let tokenDocument = await getUserIDFromToken(token);
        let userID = tokenDocument.userID;

        await updateUserPassword(userID, hashPassword);

        let newToken = await makeHash(userID);
        let alphaNumericToken = alphaNumericize(newToken);

        await updateUserToken(userID, alphaNumericToken);

        response.cookie('token', alphaNumericToken, {maxAge: TOKEN_LIFE_SPAN, httpOnly: false});
        response.status(204).end();
    } else {
        response.status(401).end();
    }
        

}

module.exports = changePassword;