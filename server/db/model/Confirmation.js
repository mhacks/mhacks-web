var mongoose = require('../index.js'),
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
    });

// Define the document Schema
var schema = new mongoose.Schema({
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
            placeholder: '(313) 867-5509'
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
        enum: ['highschool', 'bachelor', 'master', 'doctorate'],
        required: true,
        form: {
            user_editable: true,
            label: 'Degree Type',
            select: ['High School', 'Bachelors', 'Masters', 'Doctorate']
        }
    },
    employment: {
        type: String,
        enum: ['internship', 'fulltime', 'coop', 'none'],
        required: true,
        form: {
            user_editable: true,
            label: 'Job Interest',
            select: ['Internship', 'Full Time', 'Co-op', 'None']
        }
    },
    travel: {
        type: String,
        enum: ['bus', 'driving', 'fly', 'walking', 'other'],
        form: {
            user_editable: true,
            label: 'Travel',
            select: ['MHacks Bus', 'Driving', 'Flying', 'Walking', 'Other']
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

// Initialize the model with the schema, and export it
var model = mongoose.model('Confirmation', schema);

module.exports = model;
