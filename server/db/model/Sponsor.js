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
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Name'
            }
        },
        domain: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Domain'
            }
        },
        level: {
            type: String,
            enum: ['bronze', 'silver', 'gold', 'platinum'],
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Level',
                select: ['Bronze', 'Silver', 'Gold', 'Platinum']
            }
        },
        logo: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Logo',
                type_override: 'file'
            }
        },
        logo_size: {
            type: String,
            enum: ['small', 'medium', 'large'],
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Logo Size',
                select: ['Small', 'Medium', 'Large']
            }
        },
        url: {
            type: String,
            form: {
                auth_groups: ['admin'],
                label: 'URL (link)'
            }
        },
        save_button: {
            type: String,
            form: {
                label: 'Save',
                type_override: 'submit'
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
