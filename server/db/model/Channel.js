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
        name: {
            type: String,
            required: true,
            form: {
                auth_groups: ['admin'],
                label: 'Channel Name'
            }
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
        ],
        user_joinable: {
            type: Boolean,
            default: false
        }
    }),
    defaultOptions
);

schema.query.byMember = function(user) {
    return this.find({ 'members.user': user });
};

schema.query.byCreator = function(user) {
    return this.find({ creator: user });
};

schema.query.byUserJoinable = function(joinable) {
    joinable = typeof joinable === 'undefined' ? true : joinable;

    return this.find({ user_joinable: joinable });
};

schema.query.byMemberOrJoinable = function(user, joinable) {
    joinable = typeof joinable === 'undefined' ? true : joinable;

    return this.find({
        $or: [
            {
                user_joinable: joinable
            },
            {
                'members.user': user
            }
        ]
    });
};

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Channels', schema);

module.exports = model;
