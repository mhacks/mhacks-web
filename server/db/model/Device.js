var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema,
        defaultEndSchema
    } = require('../index.js'),
    sanitizerPlugin = require('mongoose-sanitizer-plugin'),
    pushCategories = ['emergency', 'logistics', 'food', 'event', 'sponsored'];

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign(
        {},
        defaultSchema,
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                form: {
                    auth_groups: ['admin'],
                    label: 'User ID',
                    type_override: String
                }
            },
            push_id: {
                type: String,
                form: {
                    user_editable: true,
                    label: 'Push ID'
                }
            },
            push_categories: {
                type: [String],
                default: pushCategories,
                form: {
                    user_editable: true,
                    label: 'Push Categories',
                    type_override: 'array',
                    array_select: pushCategories.map(str => {
                        return {
                            value: str,
                            label: str.charAt(0).toUpperCase() + str.slice(1)
                        };
                    })
                }
            }
        },
        defaultEndSchema
    ),
    defaultOptions
);

schema.plugin(sanitizerPlugin);

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Device', schema);

module.exports = model;
