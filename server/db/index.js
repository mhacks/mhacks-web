var mongoose = require('mongoose'), config = require('../../config/default.js');

// Initialize a promise handler (even though we don't currently use them)
mongoose.Promise = global.Promise;

// Initialize the DB connection
mongoose.connect(
    'mongodb://' + config.mongo_hostname + '/' + config.backend_db,
    function(err) {
        if (err) {
            console.error(err);
        }
    }
);

module.exports = mongoose;
