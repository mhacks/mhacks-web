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
            required: true
        },
        name: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true,
            default: 0
        },
        max_count: {
            type: Number,
            required: true,
            default: -1
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        notes: {
            type: String,
            required: true
        },
        public: {
            type: Boolean,
            required: true,
            default: false
        },
        auth_groups: {
            type: [String],
            default: ['any']
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

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        this[param] = fields[param];
    }
    this.save();
};

schema.statics.getUpdateableFields = function(groups) {
    var updateables = [];

    for (var key in schema.obj) {
        var field = schema.obj[key];

        if (field.form) {
            if (field.form.user_editable) {
                updateables.push(key);
            } else if (groups) {
                groups.forEach(function(group) {
                    if (
                        field.form.auth_groups &&
                        field.form.auth_groups.indexOf(group) !== -1
                    ) {
                        updateables.push(key);
                    }
                });
            }
        }
    }

    return updateables;
};

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Scan', schema);

module.exports = model;
