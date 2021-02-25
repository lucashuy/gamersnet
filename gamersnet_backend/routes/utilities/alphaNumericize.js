'use strict';

let crypto = require('crypto');
const makeHash = require('./makeHash');

async function alphaNumericize(input) {
    let token = await makeHash(input);

    // turn it into an alpha numeric string by computing MD5
    token = crypto.createHash('md5').update(token).digest('hex');

    return token;
}

module.exports = alphaNumericize;