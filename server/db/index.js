var mongoose = require('mongoose'),
    config = require('../../config/default.js');

// Initialize a promise handler (even though we don't currently use them)
mongoose.Promise = global.Promise;

// Initialize the DB connection
mongoose
    .connect('mongodb://' + config.mongo_hostname + '/' + config.backend_db, {
        useMongoClient: true
    })
    .then(res => {
        if (res) {
            console.log('Connected to MongoDB Successfully');
        }
    })
    .catch(err => {
        console.error('Error connecting to MongoDb', err);
    });

module.exports = mongoose;
