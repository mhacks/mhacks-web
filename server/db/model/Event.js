/* eslint-disable */
var mongoose = require('../index.js'),
    config = require('../../../config/default.js'),
    Schema = mongoose.Schema;
Location = require('./Location.js');

// Define the document Schema
var schema = new mongoose.Schema({
    title: String,
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
        enum: [
            'General',
            'Food',
            'Tech Talk',
            'Sponsor Event',
            'we should get a config list for this'
        ],
        default: 'General'
    },
    location: {
        type: Schema.Types.ObjectId
    }
});

// Allow us to query by name
schema.query.byName = function(name) {
    return this.findOne({
        name: new RegExp(name, 'i')
    });
};

schema.query.byLocation = function(name) {
    return Location.find()
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

schema.method.getCoordinates = function() {
    return {
        latitude: this.latitude,
        longitude: this.longitude
    };
};

schema.method.updateLocation = function(lat, lng) {
    this.latitude = lat;
    this.longitude = lng;

    return this.save();
};

// Initialize the model with the schema, and export it
var model = mongoose.model('Event', schema);

module.exports = model;
