var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema,
        defaultEndSchema
    } = require('../index.js'),
    skills = require('../../../static/misc/skills.json').map(str => {
        return {
            value: str,
            label: str
        };
    });

var schema = new mongoose.Schema(
    Object.assign(
        {},
        defaultSchema,
        {
            requestor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                form: {
                    auth_groups: ['admin'],
                    label: 'Requester ID',
                    type_override: String
                }
            },
            mentor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                form: {
                    auth_groups: ['admin'],
                    label: 'Mentor ID',
                    type_override: String
                }
            },
            is_complete: {
                type: Boolean,
                default: false,
                form: {
                    auth_groups: ['admin'],
                    label: 'Complete'
                }
            },
            skills: {
                type: [String],
                default: [],
                required: true,
                form: {
                    user_editable: true,
                    label: 'I need help in...',
                    array_select: skills,
                    type_override: 'array'
                }
            },
            title: {
                type: String,
                required: true,
                form: {
                    user_editable: true,
                    label: 'Title',
                    placeholder: 'Briefly, what is your issue?'
                }
            },
            body: {
                type: String,
                required: true,
                form: {
                    user_editable: true,
                    label: 'Description',
                    placeholder: 'Describe your issue in more detail'
                }
            },
            location_description: {
                type: String,
                required: true,
                form: {
                    user_editable: true,
                    label: 'Location',
                    placeholder: 'Describe your location'
                }
            }
        },
        defaultEndSchema
    ),
    defaultOptions
);

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('MentorshipTicket', schema);

module.exports = model;
