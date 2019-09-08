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
            },
            json: true
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
        },
        json: true
    });
}

function getBotUserID(token, bot) {
    return request({
        method: 'POST',
        uri: 'https://slack.com/api/bots.info',
        form: {
            token: token,
            bot: bot
        },
        json: true
    });
}

function getUserForID(token, user_id) {
    return request({
        method: 'POST',
        uri: 'https://slack.com/api/users.info',
        form: {
            token: token,
            user: user_id
        },
        json: true
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
        },
        json: true
    });
}

module.exports = {
    sendMessage,
    createGroupDM,
    getBotUserID,
    getUserForID,
    postSnippet
};
