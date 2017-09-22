var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    sanitizerPlugin = require('mongoose-sanitizer-plugin'),
    escapeStringRegex = require('escape-string-regexp');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        name: {
            type: String,
            form: {
                user_editable: true,
                label: 'Team Name',
                placeholder: 'Hacker McHackerTeam'
            }
        },
        description: {
            type: String,
            form: {
                user_editable: true,
                label: 'Description',
                placeholder: 'Your description goes here'
            }
        },
        //First user in the array will be the 'leader'
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        save_button: {
            type: String,
            form: {
                label: 'Create Team',
                type_override: 'submit'
            }
        }
    }),
    defaultOptions
);

//Checks the length of the description
schema.path('description').validate(function(val) {
    return val.length >= 40;
}, 'A descrpition must be at least 100 characters.');

// Allow us to query by name
schema.query.byTeamName = function(name) {
    var escapedName = escapeStringRegex(name);
    return this.findOne({
        name: new RegExp(escapedName, 'i')
    });
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

schema.plugin(sanitizerPlugin);

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Team', schema);

module.exports = model;
