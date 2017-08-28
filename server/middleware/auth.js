var User = require('../db/model/User.js'),
    Responses = require('../responses/middleware/auth.js');

module.exports = function(
    groupName,
    checkType,
    verifiedEmail,
    nextError,
    requireAuthToken
) {
    groupName = groupName || 'any';
    verifiedEmail = typeof verifiedEmail === 'boolean' ? verifiedEmail : true;
    requireAuthToken =
        typeof requireAuthToken === 'boolean' ? requireAuthToken : true;
    return function(req, res, next) {
        if (req.get('Authorization')) {
            var authorization = req.get('Authorization');
            var token = authorization.replace(/Bearer /gi, '');
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
                                                callNext(
                                                    req,
                                                    user,
                                                    token,
                                                    next
                                                );
                                            })
                                            .catch(result => {
                                                returnFailure(
                                                    res,
                                                    checkType,
                                                    result,
                                                    nextError
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
                                returnFailure(
                                    res,
                                    checkType,
                                    result,
                                    nextError
                                );
                            });
                    } else if (!requireAuthToken) {
                        callNext(
                            req,
                            {
                                fakeUser: true
                            },
                            '',
                            next
                        );
                    } else {
                        returnFailure(
                            res,
                            checkType,
                            Responses.UNAUTHORIZED,
                            nextError
                        );
                    }
                })
                .catch(() => {
                    returnFailure(
                        res,
                        checkType,
                        Responses.UNAUTHORIZED,
                        nextError
                    );
                });
        } else if (req.session && req.session.loggedIn) {
            User.find()
                .byEmail(req.session.email)
                .exec()
                .then(user => {
                    if (user) {
                        verifyEmail(verifiedEmail, user)
                            .then(() => {
                                groupCheck(groupName, user)
                                    .then(() => {
                                        callNext(
                                            req,
                                            user,
                                            user.tokens[0].token,
                                            next
                                        );
                                    })
                                    .catch(() => {
                                        returnFailure(
                                            res,
                                            checkType,
                                            Responses.UNAUTHORIZED,
                                            nextError
                                        );
                                    });
                            })
                            .catch(() => {
                                returnFailure(
                                    res,
                                    checkType,
                                    Responses.UNAUTHORIZED,
                                    nextError
                                );
                            });
                    } else {
                        returnFailure(
                            res,
                            checkType,
                            Responses.UNAUTHORIZED,
                            nextError
                        );
                    }
                })
                .catch(() => {
                    returnFailure(
                        res,
                        checkType,
                        Responses.UNAUTHORIZED,
                        nextError
                    );
                });
        } else if (!requireAuthToken) {
            callNext(
                req,
                {
                    fakeUser: true
                },
                '',
                next
            );
        } else {
            returnFailure(res, checkType, Responses.UNAUTHORIZED, nextError);
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

function callNext(req, user, token, next) {
    req.authToken = token;
    if (user.fakeUser) {
        req.name = '';
        req.email = '';
        req.groups = [];
    } else {
        req.name = user.name;
        req.email = user.email;
        req.groups = user.getGroupsList();
        req.user = user;
    }

    next();
}

function returnAPIFailure(res, message) {
    res.status(401).send({
        status: false,
        message: message
    });
}

function returnFailure(res, checkType, message, nextError) {
    if (nextError) {
        nextError();
    } else {
        if (checkType === 'api') {
            returnAPIFailure(res, message);
        } else {
            res.redirect('/');
        }
    }
}
