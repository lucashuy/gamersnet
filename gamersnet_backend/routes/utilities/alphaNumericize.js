'use strict';

let crypto = require('crypto');

function alphaNumericize(input) {
    // turn it into an alpha numeric string by computing MD5
    let output = crypto.createHash('md5').update(input).digest('hex');

    return output;
}

module.exports = alphaNumericize;