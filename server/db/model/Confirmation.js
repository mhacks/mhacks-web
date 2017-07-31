/* eslint-disable */
var mongoose = require('../index.js');

// Define the document Schema
var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    phone: {
        type: String,
        required: true
    },
    graduation: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    employment: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default: []
    }
});

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

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        this[param] = fields[param];
    }
    this.save();
};

// Initialize the model with the schema, and export it
var model = mongoose.model('Confirmation', schema);

module.exports = model;
