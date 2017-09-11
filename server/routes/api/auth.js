var router = require('express').Router(),
    validator = require('validator'),
    User = require('../../db/model/User.js'),
    Responses = require('../../responses/api/auth.js'),
    authMiddleware = require('../../middleware/auth.js');

// Disable all non-post methods for /v1/auth
router.use(function(req, res, next) {
    if (req.method !== 'POST' && req.path.indexOf('/verify/') !== 0) {
        res.status(405).send({
            status: false,
            message: Responses.METHOD_NOT_ALLOWED
        });
    }
    return next();
});

// Handles /v1/auth/login
router.post('/login', function(req, res) {
    // Check if the login request contains the email and password
    if (
        req.body.email &&
        req.body.password &&
        validator.isEmail(req.body.email)
    ) {
        // Lookup users with the email provided in the post body
        User.find()
            .byEmail(req.body.email)
            .exec()
            .then(user => {
                if (user) {
                    user
                        .checkPassword(req.body.password)
                        .then(checkRes => {
                            if (checkRes) {
                                user.getProfile().then(profile => {
                                    req.session.loggedIn = true;
                                    req.session.email = user.email;
                                    res.send({
                                        status: true,
                                        message: Responses.SUCCESSFUL_AUTH,
                                        token: user.generateNewToken(),
                                        user: profile
                                    });
                                });
                            } else {
                                res.status(401).send({
                                    status: false,
                                    message: Responses.INVALID_PASSWORD
                                });
                            }
                        })
                        .catch(() => {
                            res.status(401).send({
                                status: false,
                                message: Responses.INVALID_PASSWORD
                            });
                        });
                } else {
                    res.status(401).send({
                        status: false,
                        message: Responses.USER_NOT_FOUND
                    });
                }
            })
            .catch(() => {
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PARAMS_NOT_FOUND
        });
    }
});

// Handles /v1/auth/register
router.post('/register', function(req, res) {
    // Check if the login request contains the email and password (only required things for initial signup)
    if (
        req.body.email &&
        req.body.password &&
        req.body.full_name &&
        validator.isEmail(req.body.email)
    ) {
        // Make sure a user with the same email doesn't exist. If it doesn't,
        // instantiate the new model with the username and password, save it,
        // and generate a new JWT to be used as the Authorization header
        User.find()
            .byEmail(req.body.email)
            .exec()
            .then(user => {
                if (!user) {
                    User.create({
                        email: req.body.email.toLowerCase(),
                        password: req.body.password,
                        full_name: req.body.full_name
                    })
                        .then(user => {
                            user.sendVerificationEmail();
                            req.session.loggedIn = true;
                            req.session.email = user.email;
                            res.send({
                                status: true,
                                message: Responses.SUCCESSFUL_AUTH,
                                token: user.generateNewToken()
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).send({
                                status: false,
                                message: Responses.UNKNOWN_ERROR
                            });
                        });
                } else {
                    res.status(401).send({
                        status: false,
                        message: Responses.USER_EXISTS
                    });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PARAMS_NOT_FOUND
        });
    }
});

router.post('/verify', function(req, res) {
    if (req.body.email && validator.isEmail(req.body.email)) {
        User.find()
            .byEmail(req.body.email)
            .exec()
            .then(user => {
                if (user && !user.email_verified) {
                    user.sendVerificationEmail();
                    res.send({
                        status: true
                    });
                } else {
                    res.send({
                        status: false
                    });
                }
            })
            .catch(() => {
                res.send({
                    status: false
                });
            });
    } else {
        res.send({
            status: false,
            message: Responses.PARAMS_NOT_FOUND
        });
    }
});

router.get('/verify/:token', function(req, res) {
    User.find()
        .byVerificationToken(req.params.token)
        .exec()
        .then(user => {
            if (user) {
                user
                    .checkEmailVerificationToken(req.params.token)
                    .then(() => {
                        user.verifiedEmail();
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        })
        .catch(() => {});
    res.redirect('/profile');
});

router.post('/password', function(req, res) {
    if (req.body.email && validator.isEmail(req.body.email)) {
        User.find()
            .byEmail(req.body.email)
            .exec()
            .then(user => {
                if (user) {
                    user.sendPasswordResetEmail();
                    res.send({
                        status: true
                    });
                } else {
                    res.send({
                        status: false
                    });
                }
            })
            .catch(() => {
                res.send({
                    status: false
                });
            });
    } else {
        res.send({
            status: false,
            message: Responses.PARAMS_NOT_FOUND
        });
    }
});

router.post('/password/:token', function(req, res) {
    if (req.body.password) {
        User.find()
            .byVerificationToken(req.params.token)
            .exec()
            .then(user => {
                if (user) {
                    user
                        .checkPasswordResetToken(req.params.token)
                        .then(() => {
                            user.changePassword(req.body.password);
                            res.send({
                                status: true
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            res.send({
                                status: false
                            });
                        });
                } else {
                    res.send({
                        status: false
                    });
                }
            })
            .catch(() => {
                res.send({
                    status: false
                });
            });
    } else {
        res.send({
            status: false,
            message: Responses.PARAMS_NOT_FOUND
        });
    }
});

// Handles /v1/auth/logout
router.post('/logout', authMiddleware('any', 'api'), function(req, res) {
    if (req.session.loggedIn) {
        delete req.session.loggedIn;
    }

    User.find()
        .byToken(req.authToken)
        .exec()
        .then(user => {
            if (user) {
                user.removeToken(req.authToken);
            }
        })
        .catch(err => {
            console.error(err);
        });

    req.session.destroy();

    res.send({
        status: true
    });
});

module.exports = router;
