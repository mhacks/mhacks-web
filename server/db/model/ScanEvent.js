var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    PushNotification = require('./PushNotification.js'),
    Device = require('./Device.js');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        scanner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Scan',
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    }),
    defaultOptions
);

// Allow us to query by token
schema.query.byToken = function(findToken) {
    return mongoose
        .model('User')
        .find()
        .byToken(findToken)
        .exec()
        .then(user => {
            return this.findOne({ user: user }).exec();
        })
        .catch(() => {});
};

schema.query.byUser = function(user) {
    return this.findOne({ user: user });
};

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        this[param] = fields[param];
    }
    this.save();
};

schema.statics.getUpdateableFields = function(groups) {
    var updateables = [];

    for (var key in schema.obj) {
        var field = schema.obj[key];

        if (field.form) {
            if (field.form.user_editable) {
                updateables.push(key);
            } else if (groups) {
                groups.forEach(function(group) {
                    if (
                        field.form.auth_groups &&
                        field.form.auth_groups.indexOf(group) !== -1
                    ) {
                        updateables.push(key);
                    }
                });
            }
        }
    }

    return updateables;
};

schema.post('save', function(doc) {
    var body = '';

    if (doc.user.email === doc.scanner.email) {
        body = 'You scanned: ' + doc.event.name;
    } else {
        body = 'You were scanned in for: ' + doc.event.name;
    }

    Device.find({
        user: { $in: [[doc.user, doc.scanner]] }
    })
        .exec()
        .then(devices => {
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
