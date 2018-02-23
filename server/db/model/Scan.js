var {
    mongoose,
    defaultOptions,
    modifySchema,
    defaultSchema
} = require('../index.js');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        type: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Type'
            }
        },
        name: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Name'
            }
        },
        count: {
            type: Number,
            required: true,
            default: 0,
            form: {
                auth_groups: ['admin'],
                label: 'Count (number of scans)'
            }
        },
        max_count: {
            type: Number,
            required: true,
            default: -1,
            form: {
                auth_groups: ['admin'],
                label: 'Max number of scans'
            }
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Creator',
                type_override: String
            }
        },
        notes: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Notes'
            }
        },
        public: {
            type: Boolean,
            required: true,
            default: false,
            form: {
                auth_groups: ['admin'],
                label: 'Public'
            }
        },
        auth_groups: {
            type: [String],
            default: ['any'],
            form: {
                auth_groups: ['admin'],
                label: 'Allowed auth groups to scan'
            }
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    }),
    defaultOptions
);

schema.query.byUser = function(user) {
    return this.findOne({ user: user });
};

schema.query.byType = function(type) {
    return this.findOne({ type: type });
};

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Scan', schema);

module.exports = model;
