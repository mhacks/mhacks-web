const mongoose = require('mongoose'),
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

                return ret;
            }
        },
        timestamps: true
    },
    defaultSchema = {
        deleted: {
            type: Boolean,
            default: false
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
        const obj = Object.assign(
            { createdAt: Date, updatedAt: Date },
            schema.obj
        );
        for (const propertyName in obj) {
            (function() {
                if (
                    obj.hasOwnProperty(propertyName) &&
                    (obj[propertyName] === Date ||
                        (obj[propertyName].type &&
                            obj[propertyName].type === Date))
                ) {
                    const dateName = propertyName;
                    schema.virtual(dateName + '_ts').get(function() {
                        if (dateName in this) {
                            return new Date(this[dateName]).getTime();
                        }
                    });
                }
            })();
        }

        schema.query.since = function(since) {
            return this.find({
                updatedAt: {
                    $gte: new Date(parseInt(since || 0))
                }
            });
        };
    }
}

module.exports = {
    mongoose,
    defaultOptions,
    modifySchema,
    defaultSchema
};
