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
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            required: true
        },
        floor_image: {
            type: String,
            required: true
        },
        nw_latitude: {
            type: String,
            required: true
        },
        nw_longitude: {
            type: String,
            required: true
        },
        se_latitude: {
            type: String,
            required: true
        },
        se_longitude: {
            type: String,
            required: true
        }
    }),
    defaultOptions
);

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        this[param] = fields[param];
    }
    return this.save();
};

schema.methods.getFloorImage = function() {
    return config.host + '/v1/artifact/floor/' + this.id;
};

// All fields are updateable as only admins have power to update.
schema.statics.getUpdateableFields = function() {
    return Object.keys(schema.obj);
};

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Floor', schema);

module.exports = model;
