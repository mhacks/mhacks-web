var User = require('../db/model/User.js'),
    Responses = require('../responses/middleware/auth.js'),
    config = require('../../config/default.js');

module.exports = function(groupName, verifiedEmail) {
    groupName = groupName || 'any';
    verifiedEmail = typeof verifiedEmail === 'boolean' ? verifiedEmail : true;
    return function(socket, next) {
        console.log(socket.handshake, next);
        if (socket.handshake.session.loggedIn) {
            User.find()
                .byEmail(socket.handshake.session.email)
                .exec()
                .then(user => {
                    if (user) {
                        verifyEmail(verifiedEmail, user)
                            .then(() => {
                                groupCheck(groupName, user)
                                    .then(() => {
                                        callNext(
                                            socket.handshake,
                                            user.tokens[0].token,
                                            next
                                        );
                                    })
                                    .catch(() => {
                                        returnFailure(
                                            socket,
                                            Responses.UNAUTHORIZED
                                        );
                                    });
                            })
                            .catch(() => {
                                returnFailure(socket, Responses.UNAUTHORIZED);
                            });
                    } else {
                        returnFailure(socket, Responses.UNAUTHORIZED);
                    }
                })
                .catch(() => {
                    returnFailure(socket, Responses.UNAUTHORIZED);
                });
        } else {
            var timeout = setTimeout(function() {
                socket.disconnect(Responses.UNAUTHORIZED);
            }, config.socket_auth_timeout);

            socket.emit('authenticate');
            socket.on('authenticate', function(data) {
                clearTimeout(timeout);

                var token = data.token || '';

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
                                                        socket.handshake,
                                                        token,
                                                        next
                                                    );
                                                })
                                                .catch(result => {
                                                    returnFailure(
                                                        socket,
                                                        result
                                                    );
                                                });
                                        })
                                        .catch(() => {
                                            returnFailure(
                                                socket,
                                                Responses.UNAUTHORIZED
                                            );
                                        });
                                })
                                .catch(result => {
                                    returnFailure(socket, result);
                                });
                        } else {
                            returnFailure(socket, Responses.UNAUTHORIZED);
                        }
                    })
                    .catch(() => {
                        returnFailure(socket, Responses.UNAUTHORIZED);
                    });
            });
        }

        if (socket.connected) {
            socket.emit('authenticate', { status: true });
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

function callNext(handshake, token, next) {
    handshake.authToken = token;
    next();
}

function returnFailure(socket, message) {
    socket.emit('authenticate', { status: false, message: message });
}
