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
    //Indexed?
    broadcastAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    category: {
        type: String,
        enum: ['Emergency', 'Logistics', 'Food', 'Event', 'Sponsored']
    },
    approved: {
        type: Boolean,
        default: false
    },
    sent: {
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
    return this.findOne({
        category: category
    });
};
