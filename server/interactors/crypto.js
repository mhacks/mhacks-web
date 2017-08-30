var crypto = require('crypto'),
    config = require('../../config/default.js'),
    secret = config.secret,
    algo = 'aes-256-ctr';

function encrypt(text) {
    var cipher = crypto.createCipher(algo, secret);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algo, secret);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function createHmac(secret, body) {
    return crypto
        .createHmac('sha1', secret)
        .update(body)
        .digest('hex');
}

module.exports = {
    encrypt,
    decrypt,
    createHmac
};
