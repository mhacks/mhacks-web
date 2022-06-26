var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema,
        defaultEndSchema
    } = require('../index.js'),
    sanitizerPlugin = require('mongoose-sanitizer-plugin'),
    config = require('../../../config/default.js');

const experienceOptions = {
    novice: 'Novice',
    experienced: 'Experienced',
    veteran: 'Veteran'
};

const statusOptions = {
    unread: 'Unread',
    waitlisted: 'Waitlisted',
    accepted: 'Accepted'
};

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign(
        {},
        defaultSchema,
        {
            general_header: {
                type: String,
                form: {
                    label: 'General',
                    type_override: 'sectionheader'
                }
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                form: {
                    user_editable: false,
                    label: 'User ID'
                }
            },
            birthday: {
                type: Date,
                required: true,
                form: {
                    user_editable: true,
                    label: 'Date of Birth',
                    placeholder: 'mm/dd/yyyy'
                }
            },
            university: {
                type: String,
                form: {
                    user_editable: true,
                    type_override: 'select',
                    select: [
                        {
                            label: '/v1/form/user/universities',
                            value: '/v1/form/user/universities'
                        }
                    ],
                    label: 'University',
                    placeholder: 'e.g. University of Michigan',
                    creatable: true
                }
            },
            major: {
                type: String,
                form: {
                    user_editable: true,
                    type_override: 'select',
                    select: [
                        {
                            label: '/v1/form/user/majors',
                            value: '/v1/form/user/majors'
                        }
                    ],
                    label: 'Major',
                    placeholder: 'e.g. Computer Science',
                    creatable: true
                }
            },
            // tshirt: {
            //     type: String,
            //     required: true,
            //     enum: ['unselected', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'],
            //     form: {
            //         user_editable: true,
            //         label: 'T-Shirt',
            //         select: ['', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
            //     }
            // },
            experience: {
                type: String,
                required: true,
                enum: Object.keys(experienceOptions),
                form: {
                    user_editable: true,
                    label: 'Experience',
                    select: Object.values(experienceOptions)
                }
            },
            address: {
                type: String,
                required: true,
                form: {
                    user_editable: true,
                    label: 'Full address (for prizes!)',
                    type_override: 'essay'
                }
            },
            links_header: {
                type: String,
                form: {
                    label: 'Links',
                    type_override: 'sectionheader'
                }
            },
            resume: {
                type: String,
                form: {
                    user_editable: true,
                    label: 'Resume',
                    type_override: 'file'
                }
            },
            created_at: {
                type: Date,
                default: Date.now
            },
            github: {
                type: String,
                form: {
                    user_editable: true,
                    label: 'GitHub',
                    placeholder: 'https://github.com/'
                }
            },
            linkedin: {
                type: String,
                form: {
                    user_editable: true,
                    label: 'LinkedIn',
                    placeholder: 'https://linkedin.com/in/'
                }
            },
            devpost: {
                type: String,
                form: {
                    user_editable: true,
                    label: 'DevPost',
                    placeholder: 'https://devpost.com/'
                }
            },
            portfolio: {
                type: String,
                form: {
                    user_editable: true,
                    label: 'Portfolio',
                    placeholder: 'https://'
                }
            },
            demographics_header: {
                type: String,
                form: {
                    label: 'Demographics',
                    type_override: 'sectionheader'
                }
            },
            race: {
                type: String,
                enum: [
                    'unselected',
                    'white',
                    'black',
                    'am-indian-alaskan',
                    'asian',
                    'hispanic',
                    'other',
                    'prefer-not'
                ],
                form: {
                    user_editable: true,
                    select: [
                        '',
                        'White',
                        'Black',
                        'American Indian/Alaskan',
                        'Asian',
                        'Hispanic',
                        'Other',
                        'Prefer not to answer'
                    ],
                    label: 'Race'
                }
            },
            sex: {
                type: String,
                enum: [
                    'unselected',
                    'male',
                    'female',
                    'non-binary',
                    'prefer-not'
                ],
                form: {
                    user_editable: true,
                    select: [
                        '',
                        'Male',
                        'Female',
                        'Non Binary',
                        'Prefer not to answer'
                    ],
                    label: 'Sex'
                }
            },
            short_answer_headers: {
                type: String,
                form: {
                    label: 'Finishing Up',
                    type_override: 'sectionheader'
                }
            },
            // why_mhacks: {
            //     type: String,
            //     required: true,
            //     form: {
            //         user_editable: true,
            //         type_override: 'essay',
            //         label: 'Why do you want to come to MHacks?',
            //         placeholder: ''
            //     }
            // },
            // favorite_memory: {
            //     type: String,
            //     form: {
            //         user_editable: true,
            //         type_override: 'essay',
            //         label:
            //             'What is your favorite memory from  MHacks (if applicable)?',
            //         placeholder: ''
            //     }
            // },
            anything_else: {
                type: String,
                form: {
                    user_editable: true,
                    type_override: 'essay',
                    label: 'Anything else you would like to tell us?',
                    placeholder: ''
                }
            },
            // needs_reimbursement: {
            //     type: Boolean,
            //     default: false,
            //     form: {
            //         user_editable: true,
            //         label: 'Do you need travel reimbursement?',
            //         wideLabel: true
            //     }
            // },
            // departing_from: {
            //     type: String,
            //     form: {
            //         user_editable: true,
            //         label: 'Departing From',
            //         depends_on: 'needs_reimbursement',
            //         wideLabel: true
            //     }
            // },
            // requested_reimbursement: {
            //     type: Number,
            //     default: 0,
            //     form: {
            //         user_editable: true,
            //         label: 'How much reimbursement do you expect to need?',
            //         depends_on: 'needs_reimbursement',
            //         wideLabel: true
            //     }
            // },
            status: {
                type: String,
                enum: Object.keys(statusOptions),
                default: 'unread',
                form: {
                    label: 'Status',
                    select: Object.values(statusOptions),
                    auth_groups: ['admin', 'reader']
                }
            },
            score: {
                type: Number,
                default: 0,
                form: {
                    label: 'Score',
                    auth_groups: ['admin', 'reader']
                }
            },
            reader: {
                type: String,
                form: {
                    label: 'Reader',
                    auth_groups: ['admin', 'reader']
                }
            },
            reimbursement: {
                type: Number,
                default: 0,
                form: {
                    label: 'Reimbursement',
                    auth_groups: ['admin', 'reader']
                }
            },
            reader_filter: {
                type: Object,
                form: [
                    {
                        key: 'status',
                        enum: false,
                        default: undefined,
                        form: {
                            label: 'Status',
                            auth_groups: ['admin', 'reader'],
                            type_override: 'array',
                            array_select: Object.keys(statusOptions).map(
                                key => {
                                    return {
                                        value: key,
                                        label: statusOptions[key]
                                    };
                                }
                            )
                        }
                    },
                    {
                        key: 'needs_reimbursement',
                        label: 'Needs Reimbursement',
                        default: undefined,
                        auth_groups: ['admin', 'reader']
                    },
                    {
                        key: 'experience',
                        enum: false,
                        required: false,
                        form: {
                            label: 'Experience',
                            auth_groups: ['admin', 'reader', 'sponsor'],
                            type_override: 'array',
                            array_select: Object.keys(experienceOptions).map(
                                key => {
                                    return {
                                        value: key,
                                        label: experienceOptions[key]
                                    };
                                }
                            )
                        }
                    },
                    {
                        key: 'minor',
                        label: 'Minor',
                        type: Boolean,
                        auth_groups: ['admin', 'reader', 'sponsor']
                    },
                    {
                        key: 'search',
                        label: 'Search',
                        type: String,
                        placeholder: 'By name, uni, email',
                        auth_groups: ['admin', 'reader', 'sponsor']
                    },
                    {
                        key: 'since',
                        label: 'Since',
                        type: Date,
                        auth_groups: ['admin', 'reader']
                    }
                ]
            },
            reader_schema: {
                type: Object,
                form: [
                    {
                        key: 'review_header',
                        label: 'Review',
                        type: 'sectionheader',
                        auth_groups: ['admin', 'reader']
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        required: true
                    },
                    {
                        key: 'score',
                        label: 'Score',
                        placeholder: '0 - 10',
                        required: true
                    },
                    {
                        key: 'reimbursement',
                        label: 'Reimbursement',
                        placeholder: 'One dollar, Bob.',
                        default: 0,
                        required: true
                    },
                    {
                        key: 'save_button',
                        label: 'Save',
                        type: 'submit',
                        auth_groups: ['admin', 'reader']
                    }
                ]
            },
            mlh_coc_agreement: {
                type: Boolean,
                required: true,
                form: {
                    user_editable: true,
                    label: 'MLH Code of Conduct: I have read and agree to the MLH Code of Conduct. (https://static.mlh.io/docs/mlh-code-of-conduct.pdf)',
                    required_value: true
                }
            },
            mlh_affiliation_agreement: {
                type: Boolean,
                required: true,
                form: {
                    user_editable: true,
                    label:
                        'Event Logistics Information: I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the MLH Privacy Policy. I further agree to the terms of both the MLH Contest Terms and Conditions (https://github.com/MLH/mlh-policies/tree/master/prize-terms-and-conditions) and the MLH Privacy Policy (https://mlh.io/privacy).',
                    required_value: true
                }
            },
            mlh_optional_communication: {
                type: Boolean,
                required: false,
                form: {
                    user_editable: true,
                    label:
                        'Communication from MLH: I authorize MLH to send me an email where I can further opt into the MLH Hacker, Events, or Organizer Newsletters and other communications from MLH'
                }
            }
        },
        defaultEndSchema
    ),
    defaultOptions
);

// Allow us to query by token
schema.query.byToken = function(findToken) {
    return mongoose
        .model('User')
        .find()
        .byToken(findToken)
        .then(user => {
            return this.findOne({ user: user });
        })
        .catch(() => {});
};

// Allow us to query by email
schema.query.byEmail = function(email) {
    return mongoose
        .model('User')
        .find()
        .byEmail(email)
        .then(user => {
            return this.findOne({
                user: user
            });
        })
        .catch(() => {});
};

schema.query.byUser = function(user) {
    return this.findOne({
        user
    });
};

schema.methods.getResume = function() {
    if (this.resume) {
        return (
            config.host +
            '/v1/artifact/resume/' +
            this.user.email +
            '?application=true'
        );
    }
    return null;
};

schema.plugin(sanitizerPlugin);

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Application', schema);

module.exports = model;
