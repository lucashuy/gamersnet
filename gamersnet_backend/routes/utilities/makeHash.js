'use strict';

let bcrypt = require('bcrypt');

async function makeHash(input) {
    let returnHash;

    await bcrypt.hash(input.toString(), 10).then((hash) => returnHash = hash);

    return returnHash;
}

module.exports = makeHash;