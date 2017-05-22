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
    verification_tokens: [
        {
            created_at: {
                type: Date,
                default: Date.now
            },
            token: String,
            tokenType: String
        }
    ],
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
            created_at: {
                type: Date,
                default: Date.now
            },
            token: String
        }
    ],
    old_tokens: [
        {
            created_at: {
                type: Date,
                default: Date.now
            },
            token: String
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    },
    birthday: Date,
    groups: [
        {
            name: String
        }
    ],
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
        verification_tokens: {
            $elemMatch: {
                token: findToken
            }
        }
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

    var newToken = jwt.sign(
        {
            email: this.email
        },
        secret,
        {
            expiresIn: '14d'
        }
    );

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

schema.methods.generateEmailVerificationToken = function() {
    var token = this.generateTempToken('email_verification');

    return token;
};

schema.methods.generatePasswordResetToken = function() {
    var token = this.generateTempToken('password_reset');

    return token;
};

schema.methods.generateTempToken = function(tokenType) {
    var newToken = jwt.sign(
        {
            email: this.email,
            tokenType: tokenType
        },
        secret,
        {
            expiresIn: '30m'
        }
    );

    this.verification_tokens.push({
        token: newToken,
        tokenType: tokenType
    });

    this.save();

    return newToken;
};

schema.methods.checkEmailVerificationToken = function(token) {
    return this.checkTempToken(token, 'email_verification');
};

schema.methods.checkPasswordResetToken = function(token) {
    return this.checkTempToken(token, 'password_reset');
};

schema.methods.checkTempToken = function(token, tokenType) {
    return new Promise((resolve, reject) => {
        try {
            var tokenData = jwt.verify(token, secret);
            if (
                this.email == tokenData.email &&
                tokenData.tokenType == tokenType
            ) {
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

    var verification_tokens = this.verification_tokens;
    this.verification_tokens.forEach(function(tokenInfo, elem) {
        if (tokenInfo.tokenType === 'email_verification') {
            verification_tokens.splice(elem, 1);
        }
    });

    this.verification_tokens = verification_tokens;

    this.save();
};

schema.methods.changePassword = function(password) {
    this.password = password;

    var verification_tokens = this.verification_tokens;
    this.verification_tokens.forEach(function(tokenInfo, elem) {
        if (tokenInfo.tokenType === 'password_reset') {
            verification_tokens.splice(elem, 1);
        }
    });

    this.verification_tokens = verification_tokens;

    this.save();
};

schema.methods.sendVerificationEmail = function() {
    Email.sendEmailTemplate(
        config.confirmation_email_template,
        {
            confirmation_url: config.host +
                '/v1/auth/verify/' +
                this.generateEmailVerificationToken(),
            FIRST_NAME: this.full_name.split(' ')[0]
        },
        config.confirmation_email_subject,
        this.email,
        config.email_from,
        config.email_from_name
    ).catch(error => {
        console.error('MANDRILL', error);
        return false;
    });
};

schema.methods.sendPasswordResetEmail = function() {
    Email.sendEmailTemplate(
        config.password_reset_email_template,
        {
            update_password_url: config.host +
                '/auth/passwordreset/' +
                this.generatePasswordResetToken()
        },
        config.password_reset_email_subject,
        this.email,
        config.email_from,
        config.email_from_name
    ).catch(error => {
        console.error('MANDRILL', error);
    });
};

// Password middleware to update passwords with bcrypt when needed
var passwordMiddleware = function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt
        .hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            return next();
        })
        .catch(err => {
            console.error(err);
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
