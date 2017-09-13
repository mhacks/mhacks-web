var {
    mongoose,
    defaultOptions,
    modifySchema,
    defaultSchema
} = require('../index.js');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                muted: {
                    type: Boolean,
                    default: false
                },
                notifications_enabled: {
                    type: Boolean,
                    default: true
                }
            }
        ]
    }),
    defaultOptions
);

schema.query.byMember = function(user) {
    return this.find({ 'members.user': user });
};

schema.query.byCreator = function(user) {
    return this.find({ creator: user });
};

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('PrivateMessages', schema);

module.exports = model;
