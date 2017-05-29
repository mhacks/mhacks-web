var request = require('request-promise-native');

function sendMessage(response_url, message) {
    return request({
        method: 'POST',
        uri: response_url,
        body: message,
        json: true
    });
}

module.exports = {
    sendMessage
};
