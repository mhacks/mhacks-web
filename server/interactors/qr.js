var qrcode = require('qrcode'),
    config = require('../../config/default.js'),
    options = {
        scale: 20,
        color: {
            dark: config.color_dark,
            light: config.color_light
        }
    };

function generateQRCode(text, cb) {
    qrcode.toDataURL(text, options, cb);
}

function generateQRCodeString(text, cb) {
    qrcode.toString(text, options, cb);
}

function writeQRCodeToStream(text, stream) {
    qrcode.toFileStream(stream, text, options);
}

module.exports = {
    generateQRCode,
    writeQRCodeToStream,
    generateQRCodeString
};
