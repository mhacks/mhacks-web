var mongoose = require('../index.js'), User = require('./User.js');

// Define the document Schema
var schema = new mongoose.Schema({
    user: String,
    experience: {
        type: String,
        enum: ['veteran', 'novice']
    }
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

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        this[param] = fields[param];
    }
    this.save();
};

// Initialize the model with the schema, and export it
var model = mongoose.model('Application', schema);

module.exports = model;
