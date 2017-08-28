var mongoose = require('../index.js'),
    escapeStringRegex = require('escape-string-regexp');

// Define the document Schema
var schema = new mongoose.Schema({
    name: String,
    latitude: mongoose.Schema.Types.Decimal128,
    longitude: mongoose.Schema.Types.Decimal128
});

// Allow us to query by name
schema.query.byName = function(name) {
    var escapedName = escapeStringRegex(name);
    return this.findOne({
        name: new RegExp(escapedName, 'i')
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
var model = mongoose.model('Location', schema);

module.exports = model;
