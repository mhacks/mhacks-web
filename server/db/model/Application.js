/* eslint-disable */
var mongoose = require('../index.js'),
    config = require('../../../config/default.js'),
    User = require('./User.js');

// Define the document Schema
var schema = new mongoose.Schema({
    user: String,
    hackathon_count: Number,
    group_members: [
        {
            email: String
        }
    ]
});

// Allow us to query by token
schema.query.byToken = function(findToken) {
    return Promise(function(resolve, reject) {
        User.find()
            .byToken(findToken)
            .exec()
            .then(user => {
                resolve(
                    this.findOne({
                        user: user.email
                    })
                );
            })
            .catch(() => {
                reject();
            });
    });
};

schema.methods.addGroupMember = function(email) {
    if (!this.checkGroupMember(email)) {
        this.group_members.push({ email: email });
        this.save();

        return true;
    } else {
        return false;
    }
};

schema.methods.checkGroupMember = function(email) {
    return this.getGroupMembers().indexOf(email) !== -1;
};

schema.methods.getGroupMembers = function() {
    var members = [];

    this.group_members.forEach(function(data) {
        members.push(data.email);
    });

    return members;
};

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        if (this.hasOwnProperty(param)) {
            this[param] = fields[param];
        }
    }
    this.save();
};

// Initialize the model with the schema, and export it
var model = mongoose.model('Application', schema);

module.exports = model;
