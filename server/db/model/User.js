var bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    mongoose = require('../index.js'),
    config = require('../../../config/default.js'),
    Schema = mongoose.Schema,
    secret = config.secret;

// Define the document Schema
var userSchema = new Schema({
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
        token: String
    }],
    old_tokens: [{
        token: String
    }],
    created_date: {
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
userSchema.query.byName = function(name) {
    return this.findOne({
        full_name: new RegExp(name, 'i')
    });
};

// Allow us to query by email
userSchema.query.byEmail = function(email) {
    return this.findOne({
        email: new RegExp(email, 'i')
    });
};

// Allow us to query by token
userSchema.query.byToken = function(findToken) {
    return this.findOne({
        tokens: {
            $elemMatch: {
                token: findToken
            }
        }
    });
};

// Verify the token is correct
userSchema.methods.verifyToken = function(token) {
    try {
        tokenData = jwt.verify(token, secret);
        if (this.email == tokenData.email) {
            return [true, null];
        } else {
            return [false, 'Email does not match token'];
        }
    } catch (err) {
        console.error(err);
        switch(err.name) {
            case 'TokenExpiredError':
                break;
            case 'JsonWebTokenError':
                break;
            default:
                break;
        }
        return [false, err.message];
    }
};

// Handle bcrypt password comparison
userSchema.methods.checkPassword = function(suppliedPassword, cb) {
    bcrypt.compare(suppliedPassword, this.password, cb);
};

// Generate a new JWT
userSchema.methods.generateNewToken = function() {
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
userSchema.methods.removeToken = function(token) {
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
userSchema.pre('save', passwordMiddleware);
userSchema.pre('findOneAndUpdate', passwordMiddleware);
userSchema.pre('update', passwordMiddleware);

// Initialize the model with the schema, and export it
var userModel = mongoose.model('User', userSchema);

module.exports = userModel;