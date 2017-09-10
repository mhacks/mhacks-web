var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    sanitizerPlugin = require('mongoose-sanitizer-plugin'),
    config = require('../../../config/default.js');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        general_header: {
            type: String,
            form: {
                label: 'General',
                type_override: 'sectionheader'
            }
        },
        talk_type: {
            type: String,
            enum: ['techtalk', 'workshop'],
            required: true,
            form: {
                user_editable: true,
                label:
                    'Would you like to give a Tech Talk (give a presentation, possibly followed by a Q&A session) or a Workshop (interactive, more hands-on for the audience)?',
                select: ['Tech Talk', 'Workshop']
            }
        },
        talk_length: {
            type: String,
            enum: ['lightning', 'regular'],
            required: true,
            form: {
                user_editable: true,
                label:
                    'Would you like to give a Lightning Talk (total time 30 min) or a Regular Talk (total time 1 hr)?',
                select: ['Lightning Talk', 'Regular Talk']
            }
        },
        topic: {
            type: String,
            required: true,
            form: {
                user_editable: true,
                label: 'Topic/Title for your talk'
            }
        },
        abstract: {
            type: String,
            required: true,
            form: {
                user_editable: true,
                label: 'Abstract/Summary for the talk',
                type_override: 'essay'
            }
        },
        qualifications: {
            type: String,
            required: true,
            form: {
                user_editable: true,
                label:
                    'List down anything that qualifies you to be a mentor (e.g. projects, classes, work experience, hobbies, past hackathons, etc.)',
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
        birthday: {
            type: Date,
            required: true,
            form: {
                user_editable: true,
                label: 'Date of Birth',
                placeholder: 'mm/dd/yyyy'
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
        save_button: {
            type: String,
            form: {
                label: 'Save',
                type_override: 'submit'
            }
        },
        created_at: {
            type: Date,
            default: Date.now
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

schema.query.byUser = function(user) {
    return this.findOne({ user: user });
};

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        this[param] = fields[param];
    }
    this.save();
};

schema.methods.getResume = function() {
    return (
        config.host +
        '/v1/artifact/resume/' +
        this.user.email +
        '?application=true'
    );
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

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('SpeakerApplication', schema);

module.exports = model;
