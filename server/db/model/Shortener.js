var {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    config = require('../../../config/default.js'),
    sanitizerPlugin = require('mongoose-sanitizer-plugin');

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        long_url: {
            type: String,
            required: true
        },
        short_code: {
            type: String,
            unique: true,
            default: function() {
                var text = '';
                var possible =
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                for (var i = 0; i < 3; i++)
                    text += possible.charAt(
                        Math.floor(Math.random() * possible.length)
                    );

                return text;
            }
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        clicks: [
            {
                ip: String,
                time: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    }),
    defaultOptions
);

schema.query.byShortCode = function(short_code) {
    return this.findOne({
        short_code: short_code
    });
};

schema.methods.getUrl = function() {
    return config.shortener_host + '/' + this.short_code;
};

schema.methods.click = function(ip) {
    this.clicks.push({ ip: ip });
    this.save();
};

schema.virtual('short_url').get(function() {
    return this.getUrl();
});

schema.plugin(sanitizerPlugin);

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('Shortener', schema);

module.exports = model;
