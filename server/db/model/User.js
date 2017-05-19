var bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    mongoose = require('../index.js'),
    config = require('../../../config/default.js'),
    Email = require('../../interactors/email.js'),
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
    verification_token: String,
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

// Allow us to query by token
schema.query.byVerificationToken = function(findToken) {
    return this.findOne({
        verification_token: findToken
    });
};

// Verify the token is correct
schema.methods.verifyToken = function(token) {
    return new Promise((resolve, reject) => {
        try {
            var tokenData = jwt.verify(token, secret);
            if (this.email == tokenData.email) {
                resolve(true);
            } else {
                reject('Email does not match token');
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
            reject(err.message);
        }
    });
};

// Handle bcrypt password comparison
schema.methods.checkPassword = function(suppliedPassword) {
    return bcrypt.compare(suppliedPassword, this.password);
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

schema.methods.generateVerificationToken = function() {
    var newToken = jwt.sign({
        email: this.email,
        type: 'email_verification'
    }, secret, {
        expiresIn: '30m'
    });

    this.verification_token = newToken;
    this.save();

    return newToken;
};

schema.methods.checkVerificationToken = function(token) {
    return new Promise((resolve, reject) => {
        try {
            var tokenData = jwt.verify(token, secret);
            if (this.email == tokenData.email && tokenData.type == 'email_verification') {
                resolve(true);
            } else {
                reject('Token not valid');
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
            reject(err.message);
        }
    });
};

schema.methods.verifiedEmail = function() {
    this.email_verified = true;
    this.verification_token = undefined;

    this.save();
};

schema.methods.sendVerificationEmail = function() {
    Email.sendVerificationEmail(
        config.confirmation_email_template,
        {
            confirmation_url: config.host + '/v1/auth/verify/' + this.generateVerificationToken(),
            FIRST_NAME: this.full_name.split(' ')[0]
        },
        config.confirmation_email_subject,
        this.email,
        config.email_from,
        config.email_from_name
    ).then((result) => {
        console.log('MANDRILL', result);
    }).catch((error) => {
        console.error('MANDRILL', error);
    });
};

// Password middleware to update passwords with bcrypt when needed
var passwordMiddleware = function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10).then((hash) => {
        user.password = hash;
        return next();
    }).catch((err) => {
        console.log(err);
        return next(err);
    });
};

// Set the update middleware on each of the document save and update events
schema.pre('save', passwordMiddleware);
schema.pre('findOneAndUpdate', passwordMiddleware);
schema.pre('update', passwordMiddleware);

// Initialize the model with the schema, and export it
var model = mongoose.model('User', schema);

module.exports = model;