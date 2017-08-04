var PushNotifications = require('node-pushnotifications'),
    config = require('../../config/default.js'),
    push = PushNotifications({
        gcm: {
            id: config.gcm_id
        },
        apn: {
            token: {
                key: './certs/key.p8', // optionally: fs.readFileSync('./certs/key.p8')
                keyId: 'ABCD',
                teamId: 'EFGH',
            },
            ...
        },
        /*adm: {
            client_id: null,
            client_secret: null
        },
        wns: {
            client_id: null,
            client_secret: null,
            notificationMethod: 'sendTileSquareBlock'
        }*/
    });