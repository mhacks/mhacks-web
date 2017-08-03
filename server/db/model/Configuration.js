var mongoose = require('../index.js');

// Define the document Schema
var schema = new mongoose.Schema({
    app_name: String,
    start_date: Date,
    end_date: Date,
    is_live_page_enabled: {
        type: Boolean,
        default: false
    },
    is_application_open: {
        type: Boolean,
        default: false
    }
});

// Allow us to query by app_name
schema.query.byAppName = function(app_name) {
    return this.findOne({
        app_name: new RegExp(app_name, 'i')
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

// Initialize the model with the schema, and export it
var model = mongoose.model('Configuration', schema);

module.exports = model;
