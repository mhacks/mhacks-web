var {
    mongoose,
    defaultOptions,
    modifySchema,
    defaultSchema
} = require('../index.js');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        name: String,
        desc: String,
        level: Number,
        image: String,
        nw_latitude: String,
        nw_longitude: String,
        se_latitude: String,
        se_longitude: String
    }),
    defaultOptions
);

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Floor', schema);

module.exports = model;
