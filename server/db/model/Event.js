var mongoose = require('../index.js');

// Define the document Schema
var schema = new mongoose.Schema({
    name: String,
    desc: String,
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: String,
        enum: ['General', 'Food', 'Tech Talk', 'Sponsor Event', 'Other'],
        default: 'General'
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    }
});

// Allow us to query by name
schema.query.byName = function(name) {
    return this.findOne({
        name: new RegExp(name, 'i')
    });
};

schema.query.byLocationName = function(name) {
    return mongoose
        .model('Location')
        .find()
        .byName(name)
        .exec()
        .then(loc => {
            return this.find({
                location: loc._id
            });
        })
        .catch(err => {
            console.error(err);
        });
};

schema.methods.getCoordinates = function() {
    return {
        latitude: this.latitude,
        longitude: this.longitude
    };
};

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        this[param] = fields[param];
    }
    return this.save();
};

// Initialize the model with the schema, and export it
var model = mongoose.model('Event', schema);

module.exports = model;
