var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    end = 2026,
    start = 2017,
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
    Object.assign({}, defaultSchema, {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
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
        confirm_button: {
            type: String,
            form: {
                label: 'Confirm',
                type_override: 'submit'
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
                        array_select: Object.keys(employements).map(function(
                            a
                        ) {
                            return {
                                value: a,
                                label: employements[a]
                            };
                        })
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
        }
    }),
    defaultOptions
);

// Allow us to query by token
schema.query.byToken = function(findToken) {
    return mongoose
        .model('User')
        .find()
        .byToken(findToken)
        .exec()
        .then(user => {
            return this.findOne({ user: user }).exec();
        })
        .catch(() => {});
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
var model = mongoose.model('Confirmation', schema);

module.exports = model;
