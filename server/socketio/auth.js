var User = require('../db/model/User.js'),
    Responses = require('../responses/middleware/auth.js'),
    config = require('../../config/default.js');

module.exports = function(io, groupName, verifiedEmail) {
    groupName = groupName || 'any';
    verifiedEmail = typeof verifiedEmail === 'boolean' ? verifiedEmail : true;
    io.use(function(socket, next) {
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
                                            socket,
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
                returnFailure(socket, Responses.UNAUTHORIZED);
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
    });
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

function callNext(socket, token, next) {
    socket.emit('authenticate', { status: true });
    socket.handshake.authToken = token;
    next();
}

function returnFailure(socket, message) {
    socket.emit('authenticate', { status: false, message: message });
    socket.disconnect(message);
}
