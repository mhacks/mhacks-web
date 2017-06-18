var mongoose = require('../index.js'),
    User = require('./User.js'),
    sanitizerPlugin = require('mongoose-sanitizer-plugin'),
    config = require('../../../config/default.js');

// Define the document Schema
var schema = new mongoose.Schema({
    user: String,
    birthday: Date,
    university: String,
    major: String,
    tshirt_size: {
        type: String,
        enum: ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']
    },
    experience: {
        type: String,
        enum: ['novice', 'experienced', 'veteran']
    },
    resume: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Allow us to query by token
schema.query.byToken = function(findToken) {
    return new Promise((resolve, reject) => {
        User.find()
            .byToken(findToken)
            .exec()
            .then(user => {
                resolve(this.findOne({ user: user.email }));
            })
            .catch(() => {
                reject();
            });
    });
};

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        this[param] = fields[param];
    }
    this.save();
};

schema.methods.getResume = function() {
    return (
        config.host + '/v1/artifact/resume/' + this.user + '?application=true'
    );
};

schema.plugin(sanitizerPlugin);

// Initialize the model with the schema, and export it
var model = mongoose.model('Application', schema);

module.exports = model;
