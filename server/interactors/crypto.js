const crypto = require('crypto'),
    config = require('../../config/default.js'),
    secret = crypto
        .createHash('sha256')
        .update(String(config.secret))
        .digest('base64')
        .substr(0, 32),
    algo = 'aes-256-ctr';

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algo, secret, iv);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return Buffer.from(iv.toString('hex') + ':' + crypted).toString('base64');
}

function decrypt(text) {
    const parts = Buffer.from(text, 'base64')
        .toString('ascii')
        .split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const cipherText = parts[1];
    const decipher = crypto.createDecipheriv(algo, secret, iv);
    let dec = decipher.update(cipherText, 'hex', 'utf8');
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
