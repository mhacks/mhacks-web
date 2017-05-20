var bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    mongoose = require('../index.js'),
    config = require('../../../config/default.js'),
    secret = config.secret;

// Define the document Schema
var schema = new mongoose.Schema({
    full_name: String,
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    email_verified: Boolean,
    password: {
        type: String,
        required: true
    },
    tokens: [{
        created_at: {
            type: Date,
            default: Date.now
        },
        token: String
    }],
    old_tokens: [{
        created_at: {
            type: Date,
            default: Date.now
        },
        token: String
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    birthday: Date,
    groups: [{
        name: String
    }],
    meta: {
        ip: String
    }
});

// Allow us to query by name
schema.query.byName = function(name) {
    return this.findOne({
        full_name: new RegExp(name, 'i')
    });
};

// Allow us to query by email
schema.query.byEmail = function(email) {
    return this.findOne({
        email: new RegExp(email, 'i')
    });
};

// Allow us to query by token
schema.query.byToken = function(findToken) {
    return this.findOne({
        tokens: {
            $elemMatch: {
                token: findToken
            }
        }
    });
};

// Verify the token is correct
schema.methods.verifyToken = function(token, callback) {
    try {
        var tokenData = jwt.verify(token, secret);
        if (this.email == tokenData.email) {
            callback(true, null);
        } else {
            callback(false, 'Email does not match token');
        }
    } catch (err) {
        console.error(err);
        switch (err.name) {
            case 'TokenExpiredError':
                break;
            case 'JsonWebTokenError':
                break;
            default:
                break;
        }
        callback(false, err.message);
    }
};

// Handle bcrypt password comparison
schema.methods.checkPassword = function(suppliedPassword, callback) {
    bcrypt.compare(suppliedPassword, this.password, callback);
};

// Generate a new JWT
schema.methods.generateNewToken = function() {
    if (this.tokens.length >= config.max_tokens) {
        this.tokens.sort(function(first, second) {
            return first.created_at - second.created_at;
        });

        this.removeToken(this.tokens[0].token);
    }
    var newToken = jwt.sign({
        email: this.email
    }, secret, {
        expiresIn: '14d'
    });

    this.tokens.push({
        token: newToken
    });
    this.save();

    return newToken;
};

// Remove a JWT (logout)
schema.methods.removeToken = function(token) {
    var removeElem = null;
    this.tokens.forEach(function(dbToken, elem) {
        if (dbToken.token === token) {
            removeElem = elem;
        }
    });

    var removed = this.tokens.splice(removeElem, 1)[0];
    this.old_tokens.push(removed);

    this.save();
};

// Password middleware to update passwords with bcrypt when needed
var passwordMiddleware = function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10, function(err, hash) {
        if (!err) {
            user.password = hash;
            return next();
        } else {
            console.log(err);
            return next(err);
        }
    });
};

// Set the update middleware on each of the document save and update events
schema.pre('save', passwordMiddleware);
schema.pre('findOneAndUpdate', passwordMiddleware);
schema.pre('update', passwordMiddleware);

// Initialize the model with the schema, and export it
var model = mongoose.model('User', schema);

module.exports = model;