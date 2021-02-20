'use strict';

let bcrypt = require('bcrypt');
let crypto = require('crypto');

async function generateToken(input) {
    let token;

    await bcrypt.hash(input.toString(), 10).then((hash) => token = hash);
    token = crypto.createHash('md5').update(token).digest('hex');

    return token;
}

module.exports = generateToken;