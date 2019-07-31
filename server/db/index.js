const cachegoose = require('cachegoose'),
    mongoose = require('mongoose'),
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
        timestamps: true,
        usePushEach: true
    },
    defaultSchema = {},
    defaultEndSchema = {
        deleted: {
            type: Boolean,
            default: false,
            form: {
                label: 'Deleted',
                auth_groups: ['admin']
            }
        },
        save_button: {
            type: String,
            form: {
                label: 'Save',
                type_override: 'submit'
            }
        },
        delete_button: {
            type: String,
            form: {
                label: 'Delete',
                auth_groups: ['admin'],
                type_override: 'submit'
            }
        }
    };

// Initialize a promise handler (even though we don't currently use them)
mongoose.Promise = global.Promise;

// Initialize the DB connection
mongoose
    .connect('mongodb://' + config.mongo_hostname + '/' + config.backend_db, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(res => {
        if (res) {
            console.log('Connected to MongoDB Successfully');
        }
    })
    .catch(err => {
        console.error('Error connecting to MongoDb', err);
    });

cachegoose(mongoose);

function modifySchema(schema) {
    if (schema.obj) {
        const obj = Object.assign(
            { createdAt: Date, updatedAt: Date },
            schema.obj
        );
        for (const propertyName in obj) {
            (function() {
                if (
                    Object.prototype.hasOwnProperty.call(obj, propertyName) &&
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

        schema.statics.getUpdateableFields = function(groups) {
            const updateables = [];

            for (const key in schema.obj) {
                if (
                    Object.prototype.hasOwnProperty.call(schema.obj, key) &&
                    schema.obj[key].form
                ) {
                    const field = schema.obj[key];

                    if (
                        Array.isArray(groups) &&
                        groups.indexOf('admin') !== -1
                    ) {
                        updateables.push(key);
                    } else if (field.form.user_editable) {
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
                } else if (
                    Object.prototype.hasOwnProperty.call(schema.obj, key) &&
                    Array.isArray(groups) &&
                    groups.indexOf('admin') !== -1
                ) {
                    updateables.push(key);
                }
            }

            return updateables;
        };

        schema.methods.updateFields = function(fields, groups) {
            let updateables = false;

            if (groups) {
                updateables = schema.statics.getUpdateableFields(groups);
            }

            for (const param in fields) {
                if (Object.prototype.hasOwnProperty.call(fields, param)) {
                    if (
                        updateables === false ||
                        updateables.indexOf(param) !== -1
                    ) {
                        this[param] = fields[param];
                    } else {
                        return false;
                    }
                }
            }

            return this.save();
        };
    }
}

module.exports = {
    mongoose,
    defaultOptions,
    modifySchema,
    defaultSchema,
    defaultEndSchema
};
