var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema,
        defaultEndSchema
    } = require('../index.js'),
    PushNotification = require('./PushNotification.js'),
    Device = require('./Device.js');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign(
        {},
        defaultSchema,
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                form: {
                    auth_groups: ['admin'],
                    label: 'User'
                }
            },
            scanner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                form: {
                    auth_groups: ['admin'],
                    label: 'Scanner'
                }
            },
            event: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Scan',
                required: true,
                form: {
                    auth_groups: ['admin'],
                    label: 'Event'
                }
            },
            created_at: {
                type: Date,
                default: Date.now
            }
        },
        defaultEndSchema
    ),
    defaultOptions
);

// Allow us to query by token
schema.query.byToken = function(findToken) {
    return mongoose
        .model('User')
        .find()
        .byToken(findToken)
        .then(user => {
            return this.findOne({ user: user });
        })
        .catch(() => {});
};

schema.query.byUser = function(user) {
    return this.findOne({ user: user });
};

schema.post('save', function(doc) {
    var body = '';

    if (doc.user.email === doc.scanner.email) {
        body = 'You scanned: ' + doc.event.name;
    } else {
        body = 'You were scanned in for: ' + doc.event.name;
    }

    Device.find({
        user: { $in: [doc.user._id, doc.scanner._id] }
    }).then(devices => {
        var device_ids = devices.map(function(device) {
            return device._id;
        });

        PushNotification.create({
            title: 'Scan Event!',
            body: body,
            category: 'logistics',
            isApproved: true,
            devices: device_ids
        });
    });
});

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('ScanEvent', schema);

module.exports = model;
