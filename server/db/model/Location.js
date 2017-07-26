/* eslint-disable */
var mongoose = require('../index.js'),
    config = require('../../../config/default.js'),
    Schema = mongoose.Schema;

// Define the document Schema
var schema = new mongoose.Schema({
    name: String,
    latitude: Schema.Types.Decimal128,
    longitude: Schema.Types.Decimal128
});

// Allow us to query by name
schema.query.byName = function(name) {
    return this.findOne({
        name: new RegExp(name, 'i')
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

    this.save();
};

// Initialize the model with the schema, and export it
var model = mongoose.model('Location', schema);

module.exports = model;
