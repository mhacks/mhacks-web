var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    config = require('../../../config/default.js'),
    escapeStringRegex = require('escape-string-regexp');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        name: {
            type: String,
            required: true
        },
        domain: {
            type: String,
            required: true
        },
        level: {
            type: String,
            enum: ['bronze', 'silver', 'gold', 'unobtanium'],
            required: true
        },
        logo: {
            type: String,
            required: true
        },
        logo_size: {
            type: String,
            enum: ['small', 'medium', 'large'],
            required: true
        },
        url: {
            type: String
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

// Allow us to query by email
schema.query.byLevel = function(level) {
    var escapedLevel = escapeStringRegex(level);
    return this.findOne({
        level: new RegExp(escapedLevel, 'i')
    });
};

schema.virtual('logo_url').get(function() {
    return config.host + '/v1/sponsor/logo/' + this.id;
});

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Sponsor', schema);

module.exports = model;
