'use strict';

let bcrypt = require('bcrypt');
let crypto = require('crypto');

async function generateToken(input) {
    let token;

    // create a new unique hash from input
    // input doesnt matter
    await bcrypt.hash(input.toString(), 10).then((hash) => token = hash);

    // turn it into an alpha numeric string by computing MD5
    token = crypto.createHash('md5').update(token).digest('hex');

    return token;
}

module.exports = generateToken;