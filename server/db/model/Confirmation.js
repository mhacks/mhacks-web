var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema,
        defaultEndSchema
    } = require('../index.js'),
    now = new Date(),
    end = now.getFullYear() + 8,
    start = now.getFullYear(),
    years = new Array(end - start)
        .fill()
        .map((_, idx) => (start + idx).toString())
        .concat(['later']),
    skills = require('../../../static/misc/skills.json').map(str => {
        return {
            value: str,
            label: str
        };
    }),
    degrees = {
        highschool: 'High School',
        bachelor: 'Bachelors',
        master: 'Masters',
        doctorate: 'Doctorate'
    },
    employements = {
        internship: 'Internship',
        fulltime: 'Full Time',
        coop: 'Co-op',
        none: 'None'
    },
    transportations = {
        bus: 'MHacks Bus',
        driving: 'Driving',
        fly: 'Flying',
        walking: 'Walking',
        other: 'Other'
    };

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
                    auth_groups: ['admin'],
                    label: 'User ID',
                    type_override: String
                }
            },
            phone: {
                type: String,
                required: true,
                form: {
                    user_editable: true,
                    label: 'Phone Number',
                    placeholder: '(734) 867-5309'
                }
            },
            graduation: {
                type: String,
                enum: years,
                required: true,
                form: {
                    user_editable: true,
                    label: 'Graduation Year',
                    select: years.slice(0, -1).concat([end + ' or later'])
                }
            },
            degree: {
                type: String,
                enum: Object.keys(degrees),
                required: true,
                form: {
                    user_editable: true,
                    label: 'Degree Type',
                    select: Object.values(degrees)
                }
            },
            employment: {
                type: String,
                enum: Object.keys(employements),
                required: true,
                form: {
                    user_editable: true,
                    label: 'Job Interest',
                    select: Object.values(employements)
                }
            },
            travel: {
                type: String,
                enum: Object.keys(transportations),
                form: {
                    user_editable: true,
                    label: 'Travel',
                    select: Object.values(transportations)
                },
                required: true
            },
            skills: {
                type: [String],
                default: [],
                form: {
                    user_editable: true,
                    label: 'Skills',
                    array_select: skills,
                    type_override: 'array'
                }
            },
            sponsor_filter: {
                type: Object,
                form: [
                    {
                        key: 'graduation',
                        enum: false,
                        form: {
                            label: 'Grad year',
                            auth_groups: ['admin', 'sponsor'],
                            type_override: 'array',
                            array_select: years
                                .slice(0, -1)
                                .concat([end + ' or later'])
                                .map(function(a) {
                                    return {
                                        value: a,
                                        label: a
                                    };
                                })
                        },
                        required: false
                    },
                    {
                        key: 'skills',
                        auth_groups: ['admin', 'sponsor']
                    },
                    {
                        key: 'degree',
                        enum: false,
                        form: {
                            label: 'Degree',
                            auth_groups: ['admin', 'sponsor'],
                            type_override: 'array',
                            array_select: Object.keys(degrees).map(function(a) {
                                return {
                                    value: a,
                                    label: degrees[a]
                                };
                            })
                        }
                    },
                    {
                        key: 'employment',
                        enum: false,
                        form: {
                            label: 'Employment',
                            auth_groups: ['admin', 'sponsor'],
                            type_override: 'array',
                            array_select: Object.keys(employements).map(
                                function(a) {
                                    return {
                                        value: a,
                                        label: employements[a]
                                    };
                                }
                            )
                        }
                    },
                    {
                        key: 'search',
                        label: 'Search',
                        type: String,
                        placeholder: 'By name, uni, email',
                        auth_groups: ['admin', 'reader', 'sponsor']
                    }
                ]
            },
            mlh_coc_agreement: {
                type: Boolean,
                required: true,
                form: {
                    user_editable: true,
                    label: 'I have read and agree to the MLH Code of Conduct.',
                    required_value: true
                }
            },
            mlh_affiliation_agreement: {
                type: Boolean,
                required: true,
                form: {
                    user_editable: true,
                    label:
                        'I authorize you to share my application/registration information for event administration, ranking, MLH administration, pre- and post-event informational e-mails, and occasional messages about hackathons in-line with the MLH Privacy Policy. I further agree to the terms of both the MLH Contest Terms and Conditions and the MLH Privacy Policy.',
                    required_value: true
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

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Confirmation', schema);

module.exports = model;
