var User = require('../db/model/User.js'),
    Responses = require('../responses/middleware/auth.js');

module.exports = function(groupName, checkType, verifiedEmail) {
    groupName = groupName || 'any';
    verifiedEmail = typeof verifiedEmail === 'boolean' ? verifiedEmail : true;
    return function(req, res, next) {
        if (req.get('Authorization')) {
            var authorization = req.get('Authorization');
            var token = authorization.replace(/Bearer /g, '');
            User.find()
                .byToken(token)
                .exec()
                .then(user => {
                    if (user) {
                        user
                            .verifyToken(token)
                            .then(() => {
                                verifyEmail(verifiedEmail, user)
                                    .then(() => {
                                        groupCheck(groupName, user)
                                            .then(() => {
                                                callNext(req, token, next);
                                            })
                                            .catch(result => {
                                                returnFailure(
                                                    res,
                                                    checkType,
                                                    result
                                                );
                                            });
                                    })
                                    .catch(() => {
                                        returnFailure(
                                            res,
                                            checkType,
                                            Responses.UNAUTHORIZED
                                        );
                                    });
                            })
                            .catch(result => {
                                returnFailure(res, checkType, result);
                            });
                    } else {
                        returnFailure(res, checkType, Responses.UNAUTHORIZED);
                    }
                })
                .catch(() => {
                    returnFailure(res, checkType, Responses.UNAUTHORIZED);
                });
        } else if (req.session.loggedIn) {
            User.find()
                .byEmail(req.session.email)
                .exec()
                .then(user => {
                    if (user) {
                        verifyEmail(verifiedEmail, user)
                            .then(() => {
                                groupCheck(groupName, user)
                                    .then(() => {
                                        callNext(req, token, next);
                                    })
                                    .catch(() => {
                                        returnFailure(
                                            res,
                                            checkType,
                                            Responses.UNAUTHORIZED
                                        );
                                    });
                            })
                            .catch(() => {
                                returnFailure(
                                    res,
                                    checkType,
                                    Responses.UNAUTHORIZED
                                );
                            });
                    } else {
                        returnFailure(res, checkType, Responses.UNAUTHORIZED);
                    }
                })
                .catch(() => {
                    returnFailure(res, checkType, Responses.UNAUTHORIZED);
                });
        } else {
            returnFailure(res, checkType, Responses.UNAUTHORIZED);
        }
    };
};

function verifyEmail(verifiedEmail, user) {
    return new Promise((resolve, reject) => {
        if (verifiedEmail) {
            if (user.email_verified) {
                resolve(true);
            } else {
                reject(false);
            }
        } else {
            resolve(true);
        }
    });
}

function groupCheck(groupName, user) {
    return new Promise((resolve, reject) => {
        if (user.checkGroup(groupName)) {
            resolve(true);
        } else {
            reject(false);
        }
    });
}

function callNext(req, token, next) {
    req.authToken = token;
    next();
}

function returnAPIFailure(res, message) {
    res.status(401).send({
        status: false,
        message: message
    });
}

function returnFailure(res, checkType, message) {
    if (checkType === 'api') {
        return returnAPIFailure(res, message);
    } else {
        res.redirect('/');
    }
}
