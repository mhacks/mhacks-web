var router = require('express').Router(),
    User = require('../db/model/User.js'),
    Responses = require('../responses/middleware/auth.js');

module.exports = function(checkType, verifiedEmail) {
    verifiedEmail = typeof(verifiedEmail) === 'boolean' ? verifiedEmail : true;
    router.use(function(req, res, next) {
        console.log("HERE", checkType, verifiedEmail, req.originalUrl);
        if (req.get('Authorization')) {
            var authorization = req.get('Authorization');
            var token = authorization.replace(/Bearer /g, '');
            User.find().byToken(token).exec().then((user) => {
                if (user) {
                    user.verifyToken(token).then((result) => {
                        if (verifiedEmail) {
                            if (user.email_verified) {
                                req.authToken = token;
                                next();
                            } else {
                                if (checkType === 'api') {
                                    res.status(401).send({
                                        status: false,
                                        message: result
                                    });
                                } else {
                                    res.redirect('/');
                                }
                            }
                        } else {
                            req.authToken = token;
                            next();
                        }
                    }).catch((result) => {
                        if (checkType === 'api') {
                            res.status(401).send({
                                status: false,
                                message: result
                            });
                        } else {
                            res.redirect('/');
                        }
                    });
                } else {
                    if (checkType === 'api') {
                        res.status(401).send({
                            status: false,
                            message: Responses.UNAUTHORIZED
                        });
                    } else {
                        res.redirect('/');
                    }
                }
            }).catch((err) => {
                if (checkType === 'api') {
                    res.status(401).send({
                        status: false,
                        message: Responses.UNAUTHORIZED
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else if (req.session.loggedIn) {
            User.find().byEmail(req.session.email).exec().then((user) => {
                if (user) {
                    if (verifiedEmail) {
                        if (user.email_verified) {
                            next();
                        } else {
                            if (checkType === 'api') {
                                res.status(401).send({
                                    status: false,
                                    message: Responses.UNAUTHORIZED
                                });
                            } else {
                                res.redirect('/');
                            }
                        }
                    } else {
                        next();
                    }
                } else {
                    if (checkType === 'api') {
                        res.status(401).send({
                            status: false,
                            message: Responses.UNAUTHORIZED
                        });
                    } else {
                        res.redirect('/');
                    }
                }
            }).catch((err) => {
                if (checkType === 'api') {
                    res.status(401).send({
                        status: false,
                        message: Responses.UNAUTHORIZED
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            if (checkType === 'api') {
                res.status(401).send({
                    status: false,
                    message: Responses.UNAUTHORIZED
                });
            } else {
                res.redirect('/');
            }
        }
    });

    return router;
};