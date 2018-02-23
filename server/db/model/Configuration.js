var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    escapeStringRegex = require('escape-string-regexp');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        app_name: String,
        start_date: Date,
        end_date: Date,
        is_live_page_enabled: {
            type: Boolean,
            default: false,
            required: true,
            form: {
                user_editable: true,
                label: 'Live Page Enabled'
            }
        },
        is_team_building_enabled: {
            type: Boolean,
            default: false,
            required: true,
            form: {
                user_editable: true,
                label: 'Team Building Enabled'
            }
        },
        is_application_open: {
            type: Boolean,
            default: false,
            required: true,
            form: {
                user_editable: true,
                label: 'Application Open'
            }
        },
        is_blackout_page_enabled: {
            type: Boolean,
            default: true,
            required: true,
            form: {
                user_editable: true,
                label: 'Blackout page enabled'
            }
        },
        save_button: {
            type: String,
            form: {
                type_override: 'submit',
                label: 'Save',
                user_editable: true
            }
        }
    }),
    defaultOptions
);

// Allow us to query by app_name
schema.query.byAppName = function(app_name) {
    var escapedName = escapeStringRegex(app_name);
    return this.findOne({
        app_name: new RegExp(escapedName, 'i')
    });
};

// Allow us to query by start_date
schema.query.byStartDate = function(since, until) {
    return this.find({
        start_date: {
            $gte: since,
            $lte: until
        }
    });
};

// Allow us to query by end_date
schema.query.byEndDate = function(since, until) {
    return this.find({
        end_date: {
            $gte: since,
            $lte: until
        }
    });
};

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Configuration', schema);

module.exports = model;
