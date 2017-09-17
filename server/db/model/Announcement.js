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
            required: true
        },
        body: {
            type: String,
            required: true
        },
        broadcastTime: {
            type: Date,
            default: Date.now,
            index: true
        },
        category: {
            type: String,
            enum: ['emergency', 'logistics', 'food', 'event', 'sponsored'],
            default: 'logistics'
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        isSent: {
            type: Boolean,
            default: false
        }
    }),
    defaultOptions
);

// All fields are updateable as only admins have power to update.
schema.statics.getUpdateableFields = function() {
    return Object.keys(schema.obj);
};

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        this[param] = fields[param];
    }
    return this.save();
};

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

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Announcement', schema);

module.exports = model;
