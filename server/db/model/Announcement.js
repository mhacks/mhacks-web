/* eslint-disable */
var mongoose = require('../index.js'),
    config = require('../../../config/default.js'),
    Schema = mongoose.Schema;

// Define the document Schema
var schema = new mongoose.Schema({
    title: String,
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
        enum: ['Emergency', 'Logistics', 'Food', 'Event', 'Sponsored']
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isSent: {
        type: Boolean,
        default: false
    }
});

// Allow us to query by title
schema.query.byTitle = function(title) {
    return this.findOne({
        title: new RegExp(title, 'i')
    });
};

// Allow us to query by token
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

// Initialize the model with the schema, and export it
var model = mongoose.model('Announcements', schema);

module.exports = model;
