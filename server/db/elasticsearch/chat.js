var client = require('./index.js');

function createEntry(user, data) {
    return client.index({
        index: 'mhacks_chat',
        type: 'message',
        body: {
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            },
            message: data.message,
            channel: data.channel,
            time: new Date()
        }
    });
}

function getEntries(channel, from, size) {
    return client.search({
        index: 'mhacks_chat',
        body: {
            query: {
                match: {
                    channel: channel
                }
            }
        },
        sort: 'time:dsc',
        size: size || 50,
        from: from || 0
    });
}

module.exports = {
    createEntry,
    getEntries
};