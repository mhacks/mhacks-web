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
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Name'
            }
        },
        latitude: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Latitude'
            }
        },
        longitude: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Longitude'
            }
        },
        floor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Floor',
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Floor',
                type_override: String
            }
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

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Location', schema);

module.exports = model;
