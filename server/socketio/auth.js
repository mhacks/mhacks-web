var User = require('../db/model/User.js'),
    Responses = require('../responses/middleware/auth.js'),
    config = require('../../config/default.js');

module.exports = function(io, groupName, verifiedEmail) {
    groupName = groupName || 'any';
    verifiedEmail = typeof verifiedEmail === 'boolean' ? verifiedEmail : true;

    for (var nsp in io.nsps) {
        io.nsps[nsp].on('connect', function(socket) {
            if (!socket.handshake && !socket.handshake.authToken) {
                delete io.nsps[nsp].connected[socket.id];
            }
        });
    }

    io.on('connection', function(socket) {
        if (socket.handshake.session && socket.handshake.session.loggedIn) {
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
                                            user,
                                            user.tokens[0].token,
                                            io
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
                                                        socket,
                                                        user,
                                                        token,
                                                        io
                                                    );
                                                })
                                                .catch(result => {
                                                    console.log(result);
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

function callNext(socket, user, token, io) {
    if (config.only_one_chat_client) {
        for (var roomName in io.sockets.sockets) {
            if (io.sockets.sockets[roomName].handshake.email === user.email) {
                io.sockets.sockets[roomName].disconnect();
                return returnFailure(socket, Responses.USER_ALREADY_CONNECTED);
            }
        }
    }

    socket.emit('authenticate', { status: true });
    socket.handshake.name = user.full_name;
    socket.handshake.email = user.email;
    socket.handshake.groups = user.getGroupsList();
    socket.handshake.authToken = token;

    for (var nsp in io.nsps) {
        if (socket.id in io.nsps[nsp].sockets) {
            io.nsps[nsp].connected[socket.id] = socket;
        }
    }
}

function returnFailure(socket, message) {
    socket.emit('authenticate', { status: false, message: message });
    socket.disconnect(message);
}
