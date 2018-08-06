var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema,
        defaultEndSchema
    } = require('../index.js'),
    escapeStringRegex = require('escape-string-regexp');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign(
        {},
        defaultSchema,
        {
            name: {
                type: String,
                required: true,
                form: {
                    auth_groups: ['admin'],
                    label: 'Name'
                }
            },
            desc: {
                type: String,
                required: true,
                form: {
                    auth_groups: ['admin'],
                    label: 'Description'
                }
            },
            startDate: {
                type: Date,
                required: true,
                form: {
                    auth_groups: ['admin'],
                    label: 'Start Date'
                }
            },
            endDate: {
                type: Date,
                required: true,
                form: {
                    auth_groups: ['admin'],
                    label: 'End Date'
                }
            },
            category: {
                type: String,
                enum: [
                    'general',
                    'food',
                    'tech talk',
                    'sponsor event',
                    'other'
                ],
                default: 'general',
                form: {
                    auth_groups: ['admin'],
                    label: 'Category',
                    select: [
                        'General',
                        'Food',
                        'Tech Talk',
                        'Sponsor Event',
                        'Other'
                    ]
                }
            },
            location: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Location',
                required: true,
                form: {
                    auth_groups: ['admin'],
                    label: 'Location',
                    type_override: String
                }
            }
        },
        defaultEndSchema
    ),
    defaultOptions
);

// Allow us to query by name
schema.query.byName = function(name) {
    var escapedName = escapeStringRegex(name);
    return this.findOne({
        name: new RegExp(escapedName, 'i')
    });
};

schema.query.byLocationName = function(name) {
    return mongoose
        .model('Location')
        .find()
        .byName(name)
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

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Event', schema);

module.exports = model;
