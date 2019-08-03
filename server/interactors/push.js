var PushNotifications = require('node-pushnotifications'),
    config = require('../../config/default.js'),
    crypto = require('./crypto.js'),
    push;

if (config.push_notifications.enabled) {
    push = new PushNotifications({
        gcm: {
            id: crypto.decrypt(config.push_notifications.gcm.id)
        },
        apn: {
            token: {
                key: crypto.decrypt(config.push_notifications.apns.key),
                keyId: crypto.decrypt(config.push_notifications.apns.key_id),
                teamId: crypto.decrypt(config.push_notifications.apns.team_id)
            },
            production: config.push_notifications.apns.production
        }
    });
}

function sendNotification(devices, title, message) {
    if (config.push_notifications.enabled) {
        var data = {
            title: title,
            body: message,
            retries: 5,
            topic: config.push_notifications.apns.topic
        };

        return push.send(devices, data);
    } else {
        return new Promise(resolve => {
            resolve(true);
        });
    }
}

module.exports = {
    sendNotification
};
