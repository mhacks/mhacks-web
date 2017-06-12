var mongoose = require('../index.js'), User = require('./User.js');

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
    resume: String
});

// Allow us to query by token
schema.query.byToken = function(findToken) {
    return new Promise(function(resolve, reject) {
        console.log(findToken);
        User.find()
            .byToken(findToken)
            .exec()
            .then(user => {
                console.log('THERE IT IS', this);

                const app = this.findOne({ user: user.email });
                console.log('THERE IT IS', app);
                resolve(
                    app
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
