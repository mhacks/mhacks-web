var {
    mongoose,
    defaultOptions,
    modifySchema,
    defaultSchema,
    defaultEndSchema
} = require('../index.js');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign(
        {},
        defaultSchema,
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                form: {
                    user_editable: false,
                    label: 'User ID',
                },
            },
            answers: {
                type: Map,
                of: String,
                required: true,
                form: {
                    user_editable: false,
                },
            },
            points: {
                type: Number,
                default: 0,
                required: true,
                form: {
                    user_editable: false,
                    label: 'Points',
                },
            },
        },
        defaultEndSchema
    ),
    defaultOptions
);

// Allow us to query by token
schema.query.byToken = function (findToken) {
    return mongoose
        .model('User')
        .find()
        .byToken(findToken)
        .then(user => {
            return this.findOne({ user: user });
        })
        .catch(() => { });
};

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('GameState', schema);

module.exports = model;