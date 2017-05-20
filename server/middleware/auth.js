var router = require('express').Router(),
    User = require('../db/model/User.js'),
    Responses = require('../responses/middleware/auth.js');

module.exports = function(checkType) {
    var type = checkType;
    router.use(function(req, res, next) {
        if (req.get('Authorization')) {
            var authorization = req.get('Authorization');
            var token = authorization.replace(/Bearer /g, '');
            User.find().byToken(token).exec(function(err, user) {
                if (!err && user) {
                    user.verifyToken(token, function(verification, message) {
                        if (verification) {
                            req.authToken = token;
                            next();
                        } else {
                            if (type === 'api') {
                                res.status(401).send({
                                    status: false,
                                    message: message
                                });
                            } else {
                                res.redirect('/');
                            }
                        }
                    });
                } else {
                    if (type === 'api') {
                        res.status(401).send({
                            status: false,
                            message: Responses.UNAUTHORIZED
                        });
                    } else {
                        res.redirect('/');
                    }
                }
            });
        } else if (req.session.loggedIn) {
            next();
        } else {
            if (type === 'api') {
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