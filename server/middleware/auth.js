var router = require('express').Router(),
    userModel = require('../db/model/User.js');

module.exports = function(checkType) {
    type = checkType;
    router.use(function(req, res, next) {
        if (req.get('Authorization')) {
            var authorization = req.get('Authorization');
            var token = authorization.replace(/Bearer /g, '');
            userModel.find().byToken(token).exec(function(err, user) {
                if (!err && user) {
                    var verify = user.verifyToken(token);
                    if (verify[0]) {
                        req.authToken = token;
                        next();
                    } else {
                        if (type === 'api') {
                            res.status(401).send({
                                status: false,
                                message: verify[1]
                            });
                        } else {
                            res.redirect('/');
                        }
                    }
                } else {
                    if (type === 'api') {
                        res.status(401).send({
                            status: false,
                            message: 'Unauthorized'
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
                    message: 'Unauthorized'
                });
            } else {
                res.redirect('/');
            }
        }
    });

    return router;
};