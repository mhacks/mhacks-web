var mongoose = require('../index.js'),
    sanitizerPlugin = require('mongoose-sanitizer-plugin'),
    config = require('../../../config/default.js');

// Define the document Schema
var schema = new mongoose.Schema({
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
            label: 'T-Shirt',
            select: ['Novice', 'Experienced', 'Veteran']
        }
    },
    resume: {
        type: String
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
            select: ['', 'Male', 'Female', 'Non Binary', 'Prefer not to answer'],
            label: 'Sex'
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
    review_notes: {
        type: String,
        form: {
            label: 'Notes',
            auth_groups: ['admin', 'reader']
        }
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

schema.plugin(sanitizerPlugin);

// Initialize the model with the schema, and export it
var model = mongoose.model('Application', schema);

module.exports = model;
