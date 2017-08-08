var mongoose = require('../index.js'),
    sanitizerPlugin = require('mongoose-sanitizer-plugin'),
    config = require('../../../config/default.js');

// Define the document Schema
var schema = new mongoose.Schema({
    general_header: {
        type: String,
        form: {
            label: 'General',
            type_override: 'sectionheader'
        }
    },
    user: {
        type: String,
        required: true,
        form: {
            user_editable: false,
            label: 'Email',
            placeholder: 'hackathon@umich.edu'
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
        required: true,
        form: {
            user_editable: true,
            label: 'University',
            placeholder: 'e.g. University of Michigan'
        }
    },
    major: {
        type: String,
        required: true,
        form: {
            user_editable: true,
            label: 'Major',
            placeholder: 'e.g. Computer Science'
        }
    },
    tshirt: {
        type: String,
        required: true,
        enum: ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl'],
        form: {
            user_editable: true,
            label: 'T-Shirt',
            select: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
        }
    },
    experience: {
        type: String,
        required: true,
        enum: ['novice', 'experienced', 'veteran'],
        form: {
            user_editable: true,
            label: 'Experience',
            select: ['Novice', 'Experienced', 'Veteran']
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
        enum: ['unselected', 'male', 'female', 'non-binary', 'prefer-not'],
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
            label: 'Short Answer',
            type_override: 'sectionheader'
        }
    },
    why_mhacks: {
        type: String,
        required: true,
        form: {
            user_editable: true,
            type_override: 'essay',
            label: 'Why do you want to come to MHacks?',
            placeholder: ''
        }
    },
    favorite_memory: {
        type: String,
        form: {
            user_editable: true,
            type_override: 'essay',
            label: 'What is your favorite memory from  MHacks (if applicable)?',
            placeholder: ''
        }
    },
    anything_else: {
        type: String,
        form: {
            user_editable: true,
            type_override: 'essay',
            label: 'Anything else you would like to tell us?',
            placeholder: ''
        }
    },
    needs_reimbursement: {
        type: Boolean,
        form: {
            user_editable: true,
            label: 'Do you need travel reimbursement?',
            wideLabel: true
        }
    },
    departing_from: {
        type: String,
        form: {
            user_editable: true,
            label: 'Departing From',
            wideLabel: true
        }
    },
    requested_reimbursement: {
        type: Number,
        form: {
            user_editable: true,
            label: 'How much reimbursement do you expect to need?',
            wideLabel: true
        }
    },
    status: {
        type: String,
        enum: ['unread', 'waitlisted', 'accepted'],
        default: 'unread',
        form: {
            label: 'Status',
            select: ['Unread', 'Waitlisted', 'Accepted'],
            auth_groups: ['admin', 'reader']
        }
    },
    score: {
        type: Number,
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
                label: 'Status'
            },
            {
                key: 'needs_reimbursement',
                label: 'Needs Reimbursement'
            },
            {
                key: 'experience',
                label: 'Experience',
                required: false
            },
            {
                key: 'minor',
                label: 'Minor',
                type: Boolean,
                auth_groups: ['admin', 'reader']
            },
            {
                key: 'search',
                label: 'Search',
                type: String,
                placeholder: 'By name, uni, email',
                auth_groups: ['admin', 'reader']
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
                label: 'Status'
            },
            {
                key: 'score',
                label: 'Score'
            },
            {
                key: 'reimbursement',
                label: 'Reimbursement'
            },
            {
                key: 'save_button',
                label: 'Save',
                type: 'submit',
                auth_groups: ['admin', 'reader']
            }
        ]
    }
});

// Allow us to query by token
schema.query.byToken = function(findToken) {
    return mongoose
        .model('User')
        .find()
        .byToken(findToken)
        .exec()
        .then(user => {
            return this.findOne({ user: user.email }).exec();
        })
        .catch(() => {});
};

// Allow us to query by token
schema.query.byEmail = function(email) {
    return mongoose
        .model('User')
        .find()
        .byEmail(email)
        .then(user => {
            return this.findOne({ user: user.email });
        })
        .catch(() => {});
};

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        this[param] = fields[param];
    }
    this.save();
};

schema.methods.getResume = function() {
    return (
        config.host + '/v1/artifact/resume/' + this.user + '?application=true'
    );
};

schema.methods.getUser = function() {
    return mongoose.model('User').find().byEmail(this.user).exec();
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

schema.plugin(sanitizerPlugin);

// Initialize the model with the schema, and export it
var model = mongoose.model('Application', schema);

module.exports = model;
