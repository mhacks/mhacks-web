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
    tshirt: {
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
    },
    github: String,
    linkedin: String,
    devpost: String,
    portfolio: String,
    race: {
        type: String,
        enum: [
            'unselected',
            'white',
            'black',
            'am-indian-alaskan',
            'asian',
            'hispanic',
            'other',
            'prefer-not'
        ]
    },
    sex: {
        type: String,
        enum: ['unselected', 'male', 'female', 'non-binary', 'prefer-not']
    },
    why_mhacks: String,
    favorite_memory: String,
    anything_else: String,
    needs_reimbursement: Boolean,
    departing_from: String,
    requested_reimbursement: Number
});

// Allow us to query by token
schema.query.byToken = function(findToken) {
    return User.find()
        .byToken(findToken)
        .exec()
        .then(user => {
            return this.findOne({ user: user.email }).exec();
        })
        .catch(() => {});
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

schema.methods.getUser = function() {
    return User.find().byEmail(this.user).exec();
};

schema.plugin(sanitizerPlugin);

// Initialize the model with the schema, and export it
var model = mongoose.model('Application', schema);

module.exports = model;
