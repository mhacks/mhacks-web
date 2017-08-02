/* eslint-disable */
var mongoose = require('../index.js'),
    end = 2026,
    start = 2017,
    years = new Array(end - start).fill().map((_, idx) => start + idx),
    skills = require('../../../static/misc/skills.json').map((str, idx) => {
        return {
            value: idx,
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
            select: years
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
        enum: ['bus', 'driving', 'fly', 'other'],
        form: {
            user_editable: true,
            label: 'Travel',
            select: ['MHacks Bus', 'Driving', 'Flying', 'Other']
        }
    },
    skills: {
        type: [String],
        default: [],
        form: {
            user_editable: true,
            label: 'Skills',
            array_select: skills
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

// Initialize the model with the schema, and export it
var model = mongoose.model('Confirmation', schema);

module.exports = model;
