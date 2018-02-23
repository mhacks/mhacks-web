var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    config = require('../../../config/default.js');

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
        desc: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Description'
            }
        },
        level: {
            type: Number,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Level'
            }
        },
        floor_image: {
            type: String,
            form: {
                auth_groups: ['admin'],
                label: 'Floor Image',
                type_override: 'file'
            }
        },
        nw_latitude: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Northwest Latitude'
            }
        },
        nw_longitude: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Northwest Longitude'
            }
        },
        se_latitude: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Southeast Latitude'
            }
        },
        se_longitude: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Southeast Longitude'
            }
        }
    }),
    defaultOptions
);

schema.methods.getFloorImage = function() {
    return config.host + '/v1/artifact/floor/' + this.id;
};

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Floor', schema);

module.exports = model;
