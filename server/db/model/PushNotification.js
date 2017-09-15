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
            default: ''
        },
        body: {
            type: String,
            default: ''
        },
        broadcastTime: {
            type: Date,
            default: Date.now,
            index: true
        },
        category: {
            type: String,
            enum: ['emergency', 'logistics', 'food', 'event', 'sponsored']
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        isSent: {
            type: Boolean,
            default: false
        },
        devices: {
            type: [String],
            default: []
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
