var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    escapeStringRegex = require('escape-string-regexp');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        title: {
            type: String,
            default: '',
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Title'
            }
        },
        body: {
            type: String,
            default: '',
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Body'
            }
        },
        broadcastTime: {
            type: Date,
            default: Date.now,
            index: true,
            form: {
                auth_groups: ['admin'],
                label: 'Broadcast Time'
            }
        },
        category: {
            type: String,
            enum: ['emergency', 'logistics', 'food', 'event', 'sponsored'],
            form: {
                auth_groups: ['admin'],
                label: 'Body',
                select: ['Emergency', 'Logistics', 'Food', 'Event', 'Sponsored']
            }
        },
        isApproved: {
            type: Boolean,
            default: false,
            form: {
                auth_groups: ['admin'],
                label: 'Approved'
            }
        },
        isSent: {
            type: Boolean,
            default: false,
            form: {
                auth_groups: ['admin'],
                label: 'Sent'
            }
        },
        devices: {
            type: [String],
            default: [],
            form: {
                auth_groups: ['admin'],
                label: 'Devices'
            }
        }
    }),
    defaultOptions
);

// Allow us to query by title
schema.query.byTitle = function(title) {
    var escapedTitle = escapeStringRegex(title);
    return this.findOne({
        title: new RegExp(escapedTitle, 'i')
    });
};

// Allow us to query by category
schema.query.byCategory = function(category) {
    return this.find({
        category: category
    });
};

// Allow us to query by broadcastTime
schema.query.byBroadcastTime = function(since, until) {
    return this.find({
        broadcastTime: {
            $gte: since,
            $lte: until
        }
    });
};

// Allow us to query for announcements before the current date
schema.query.beforeNow = function() {
    return this.find({
        broadcastTime: {
            $lte: Date.now()
        }
    });
};

// Allow us to query by isApproved
schema.query.byIsApproved = function() {
    return this.find({
        isApproved: true
    });
};

// Allow us to query by isSent
schema.query.byIsSent = function() {
    return this.find({
        isSent: true
    });
};

// Allow us to query for isApproved and isSent
schema.query.byIsPublic = function(since) {
    return this.find({
        isApproved: true,
        isSent: true,
        broadcastTime: {
            $lte: new Date()
        },
        updatedAt: {
            $gte: new Date(parseInt(since || 0))
        }
    });
};

schema.query.byIsReadyToSend = function() {
    return this.find({
        isApproved: true,
        isSent: false,
        broadcastTime: {
            $lte: Date.now()
        }
    });
};

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('PushNotification', schema);

module.exports = model;
