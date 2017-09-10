var mongoose = require('mongoose'),
    config = require('../../config/default.js'),
    defaultOptions = {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true,
            transform: function(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    };

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

function modifySchema(schema) {
    if (schema.obj) {
        for (var propertyName in schema.obj) {
            if (
                schema.obj.hasOwnProperty(propertyName) &&
                schema.obj[propertyName].type &&
                schema.obj[propertyName].type === Date
            ) {
                var dateName = propertyName;
                schema.virtual(dateName + '_ts').get(function() {
                    if (dateName in this) {
                        return new Date(this[dateName]).getTime();
                    }
                });
            }
        }
    }
}

module.exports = {
    mongoose,
    defaultOptions,
    modifySchema
};
