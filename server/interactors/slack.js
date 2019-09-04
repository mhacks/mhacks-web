var request = require('request-promise-native'),
    validator = require('validator');

function sendMessage(location, message) {
    if (validator.isURL(location)) {
        return request({
            method: 'POST',
            uri: location,
            body: message,
            json: true
        });
    } else {
        return request({
            method: 'POST',
            uri: 'https://slack.com/api/chat.postMessage',
            form: {
                token: location,
                channel: message.channel,
                text: message.text,
                blocks: message.blocks
            }
        });
    }
}

function createGroupDM(token, users) {
    return request({
        method: 'POST',
        uri: 'https://slack.com/api/conversations.open',
        form: {
            token: token,
            users: users.join()
        }
    });
}

function getBotUserID(token, bot) {
    return request({
        method: 'POST',
        uri: 'https://slack.com/api/bots.info',
        form: {
            token: token,
            bot: bot
        }
    });
}

function postSnippet(token, message) {
    return request({
        method: 'POST',
        uri: 'https://slack.com/api/files.upload',
        form: {
            token: token,
            channels: message.channels,
            content: message.content,
            title: message.title
        }
    });
}

module.exports = {
    sendMessage,
    createGroupDM,
    getBotUserID,
    postSnippet
};
