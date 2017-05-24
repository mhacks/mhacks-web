var User = require('../db/model/User.js'),
    Responses = require('../responses/middleware/auth.js');

module.exports = function(groupName, checkType, verifiedEmail) {
    groupName = groupName || 'all';
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
                            .then(result => {
                                verifyEmail(
                                    user,
                                    req,
                                    res,
                                    token,
                                    groupName,
                                    checkType,
                                    next,
                                    result,
                                    verifiedEmail
                                );
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
                        verifyEmail(
                            user,
                            req,
                            res,
                            token,
                            groupName,
                            checkType,
                            next,
                            Responses.UNAUTHORIZED,
                            verifiedEmail
                        );
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

function verifyEmail(
    user,
    req,
    res,
    token,
    groupName,
    checkType,
    next,
    message,
    verifiedEmail
) {
    if (verifiedEmail) {
        if (user.email_verified) {
            groupCheck(
                user,
                req,
                res,
                token,
                groupName,
                checkType,
                next,
                message
            );
        } else {
            returnFailure(res, checkType, Responses.UNAUTHORIZED);
        }
    } else {
        groupCheck(user, req, res, token, groupName, checkType, next, message);
    }
}

function groupCheck(
    user,
    req,
    res,
    token,
    groupName,
    checkType,
    next,
    message
) {
    if (user.checkGroup(groupName)) {
        callNext(req, token, next);
    } else {
        returnFailure(res, checkType, message);
    }
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
