var mongoose = require('../index.js');

// Define the document Schema
var schema = new mongoose.Schema({
    name: String,
    latitude: mongoose.Schema.Types.Decimal128,
    longitude: mongoose.Schema.Types.Decimal128
});

// Allow us to query by name
schema.query.byName = function(name) {
    return this.findOne({
        name: new RegExp(name, 'i')
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
var model = mongoose.model('Location', schema);

module.exports = model;
