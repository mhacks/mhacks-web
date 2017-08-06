var PushNotifications = require('node-pushnotifications'),
    config = require('../../config/default.js'),
    push = PushNotifications({
        gcm: {
            id: new Buffer(
                crypto.decrypt(config.push_notifications.gcm.id),
                'base64'
            ).toString('ascii')
        },
        apn: {
            token: {
                key: new Buffer(
                    crypto.decrypt(config.push_notifications.apns.key),
                    'base64'
                ).toString('ascii'),
                keyId: new Buffer(
                    crypto.decrypt(config.push_notifications.apns.key_id),
                    'base64'
                ).toString('ascii'),
                teamId: new Buffer(
                    crypto.decrypt(config.push_notifications.apns.team_id),
                    'base64'
                ).toString('ascii')
            }
        }
    });

function sendNotification(devices, title, message) {
    if (config.push_notifications.enabled) {
        var data = {
            title: title,
            body: message,
            retries: 5
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
