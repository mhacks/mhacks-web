var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    sanitizerPlugin = require('mongoose-sanitizer-plugin');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        push_id: {
            type: String,
            form: {
                user_editable: true
            }
        },
        push_categories: {
            type: [String],
            default: ['emergency', 'logistics', 'food', 'event', 'sponsored'],
            form: {
                user_editable: true
            }
        }
    }),
    defaultOptions
);

schema.plugin(sanitizerPlugin);

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Device', schema);

module.exports = model;
