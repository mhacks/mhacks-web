var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    escapeStringRegex = require('escape-string-regexp');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        name: {
            type: String,
            required: true
        },
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        },
        floor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Floor',
            required: true
        }
    }),
    defaultOptions
);

// Allow us to query by name
schema.query.byName = function(name) {
    var escapedName = escapeStringRegex(name);
    return this.findOne({
        name: new RegExp(escapedName, 'i')
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

schema.statics.getUpdateableFields = function() {
    return Object.keys(schema.obj);
};

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Location', schema);

module.exports = model;
