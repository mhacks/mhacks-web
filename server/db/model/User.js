var bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    {
        mongoose,
        defaultOptions,
        modifySchema,
        defaultSchema
    } = require('../index.js'),
    config = require('../../../config/default.js'),
    Email = require('../../interactors/email.js'),
    emailResponses = require('../../responses/api/email.js'),
    crypto = require('crypto'),
    sanitizerPlugin = require('mongoose-sanitizer-plugin'),
    escapeStringRegex = require('escape-string-regexp'),
    secret = config.secret;

// Define the document Schema
var schema = new mongoose.Schema(
    Object.assign({}, defaultSchema, {
        full_name: {
            type: String,
            form: {
                user_editable: true,
                label: 'Full Name',
                placeholder: 'Hacker McHackface'
            }
        },
        email: {
            type: String,
            required: true,
            index: {
                unique: true
            },
            form: {
                user_editable: true,
                label: 'Email',
                placeholder: 'hackathon@umich.edu'
            }
        },
        email_verified: {
            type: Boolean,
            form: {
                user_editable: false,
                label: 'Email Verified'
            }
        },
        application_submitted: {
            type: Boolean,
            form: {
                user_editable: false,
                label: 'Application Submitted'
            }
        },
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
            required: true,
            form: {
                user_editable: true,
                label: 'Password',
                placeholder: 'hunter2'
            }
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
        birthday: {
            type: Date,
            form: {
                user_editable: true,
                label: 'Date of Birth',
                placeholder: 'mm/dd/yyyy'
            }
        },
        major: {
            type: String,
            form: {
                user_editable: true,
                label: 'Major',
                placeholder: 'e.g. Computer Science'
            }
        },
        university: {
            type: String,
            form: {
                user_editable: true,
                label: 'University',
                placeholder: 'e.g. University of Michigan'
            }
        },
        groups: [
            {
                name: String
            }
        ],
        meta: {
            ip: String
        },
        avatar: {
            type: String,
            form: {
                user_editable: true,
                label: 'Avatar',
                type_override: 'file'
            }
        },
        resume: {
            type: String,
            form: {
                user_editable: true,
                label: 'Resume',
                type_override: 'file'
            }
        },
        github: {
            type: String,
            form: {
                user_editable: true,
                label: 'GitHub',
                placeholder: 'https://github.com/'
            }
        },
        linkedin: {
            type: String,
            form: {
                user_editable: true,
                label: 'LinkedIn',
                placeholder: 'https://linkedin.com/in/'
            }
        },
        devpost: {
            type: String,
            form: {
                user_editable: true,
                label: 'DevPost',
                placeholder: 'https://devpost.com/'
            }
        },
        portfolio: {
            type: String,
            form: {
                user_editable: true,
                label: 'Portfolio',
                placeholder: 'https://'
            }
        },
        tshirt: {
            type: String,
            enum: ['unselected', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'],
            form: {
                user_editable: true,
                select: ['', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
                label: 'T-Shirt'
            }
        },
        race: {
            type: String,
            enum: [
                'unselected',
                'white',
                'black',
                'am-indian-alaskan',
                'asian',
                'hispanic',
                'other',
                'prefer-not'
            ],
            form: {
                user_editable: true,
                select: [
                    '',
                    'White',
                    'Black',
                    'American Indian/Alaskan',
                    'Asian',
                    'Hispanic',
                    'Other',
                    'Prefer not to answer'
                ],
                label: 'Race'
            }
        },
        sex: {
            type: String,
            enum: ['unselected', 'male', 'female', 'non-binary', 'prefer-not'],
            form: {
                user_editable: true,
                select: [
                    '',
                    'Male',
                    'Female',
                    'Non Binary',
                    'Prefer not to answer'
                ],
                label: 'Sex'
            }
        },
        online: {
            type: Boolean,
            default: false
        }
    }),
    defaultOptions
);

// Allow us to query by name
schema.query.byName = function(name) {
    var escapedName = escapeStringRegex(name);
    return this.findOne({
        full_name: new RegExp(escapedName, 'i')
    });
};

// Allow us to query by email
schema.query.byEmail = function(email) {
    var escapedEmail = escapeStringRegex(email);
    return this.findOne({
        email: new RegExp(escapedEmail, 'i')
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
            expiresIn: config.token_expiration + 'd'
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
    if (config.development) {
        console.log(
            emailResponses.VERIFICATION_URL_CONSOLE,
            config.host +
                '/v1/auth/verify/' +
                this.generateEmailVerificationToken()
        );
    } else {
        Email.sendEmailTemplate(
            config.confirmation_email_template,
            {
                confirmation_url:
                    config.host +
                    '/v1/auth/verify/' +
                    this.generateEmailVerificationToken(),
                FIRST_NAME: this.full_name
                    ? this.full_name.split(' ')[0]
                    : 'Hacker'
            },
            config.confirmation_email_subject,
            this.email,
            config.email_from,
            config.email_from_name
        ).catch(error => {
            console.error('MANDRILL', error);
            return false;
        });
    }
};

schema.methods.sendPasswordResetEmail = function() {
    if (config.development) {
        console.log(
            emailResponses.PASSWORDRESET_URL_CONSOLE,
            config.host +
                '/auth/passwordreset/' +
                this.generatePasswordResetToken()
        );
    } else {
        Email.sendEmailTemplate(
            config.password_reset_email_template,
            {
                update_password_url:
                    config.host +
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
    }
};

schema.methods.checkGroup = function(checkGroup) {
    if (checkGroup === 'any') {
        return true;
    } else {
        var returnVal = false;
        this.groups.forEach(function(data) {
            if (checkGroup.indexOf(data.name) !== -1) {
                returnVal = true;
            }
        });

        return returnVal;
    }
};

schema.methods.addGroup = function(groupName) {
    if (!this.checkGroup(groupName)) {
        this.groups.push({ name: groupName });
        this.save();

        return true;
    } else {
        return false;
    }
};

schema.methods.removeGroup = function(groupName) {
    var self = this;
    if (this.checkGroup(groupName)) {
        this.groups.forEach(function(group, elem) {
            if (group.name === groupName) {
                self.groups.splice(elem, 1);
            }
        });
        this.save();

        return true;
    } else {
        return true;
    }
};

schema.methods.getGroupsList = function() {
    var groups = [];

    this.groups.forEach(function(data) {
        groups.push(data.name);
    });

    return groups;
};

schema.methods.updateFields = function(fields) {
    for (var param in fields) {
        this[param] = fields[param];
    }
    this.save();
};

schema.methods.getAvatars = function() {
    var avatars = [];

    if (this.avatar) {
        avatars.push(config.host + '/v1/artifact/avatar/' + this.email);
    }

    avatars = avatars.concat([
        'https://www.gravatar.com/avatar/' +
            crypto
                .createHash('md5')
                .update(this.email || '')
                .digest('hex') +
            '?d=404',
        'https://api-avatar.trove.com/v1/avatar/' +
            this.email +
            '?fallback=true'
    ]);

    return avatars;
};

schema.methods.getResume = function() {
    return config.host + '/v1/artifact/resume/' + this.email;
};

schema.methods.getProfile = function() {
    const profile = {
        email: this.email,
        email_verified: this.email_verified,
        application_submitted: this.application_submitted,
        full_name: this.full_name,
        birthday: this.birthday,
        groups: this.getGroupsList(),
        major: this.major,
        university: this.university,
        resume_uploaded: !!this.resume,
        avatar: this.getAvatars(),
        github: this.github,
        linkedin: this.linkedin,
        devpost: this.devpost,
        portfolio: this.portfolio,
        tshirt: this.tshirt,
        race: this.race,
        sex: this.sex,
        id: this._id,
        online: this.online
    };

    return new Promise(resolve => {
        mongoose
            .model('Application')
            .find()
            .byEmail(this.email)
            .then(application => {
                const {
                    status,
                    needs_reimbursement,
                    reimbursement,
                    university,
                    major,
                    experience
                } = application;

                profile.application_submitted = true;
                profile.status = status;
                profile.needs_reimbursement = needs_reimbursement;
                profile.reimbursement = reimbursement;
                profile.university = university;
                profile.major = major;
                profile.experience = experience;

                if (status === 'accepted') {
                    mongoose
                        .model('Confirmation')
                        .findOne({ user: this })
                        .then(application => {
                            profile.is_confirmed = application ? true : false;
                            resolve(profile);
                        });
                } else {
                    profile.is_confirmed = false;
                    resolve(profile);
                }
            })
            .catch(() => {
                profile.application_submitted = false;
                resolve(profile);
            });
    });
};

schema.virtual('avatars').get(function() {
    return this.getAvatars();
});

schema.statics.getUpdateableFields = function(groups) {
    var updateables = [];

    for (var key in schema.obj) {
        var field = schema.obj[key];

        if (field.form) {
            if (field.form.user_editable) {
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
        }
    }

    return updateables;
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

schema.plugin(sanitizerPlugin);

modifySchema(schema);

// Initialize the model with the schema, and export it
var model = mongoose.model('User', schema);

module.exports = model;
