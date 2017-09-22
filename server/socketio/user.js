var User = require('../db/model/User.js');

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('profile', function() {
            if (socket.handshake.authToken) {
                User.find()
                    .byToken(socket.handshake.authToken)
                    .exec()
                    .then(user => {
                        if (user) {
                            user.getProfile().then(profile => {
                                socket.emit('profile', {
                                    status: true,
                                    profile
                                });
                            });
                        } else {
                            socket.emit('profile', {
                                status: false
                            });
                        }
                    })
                    .catch(err => {
                        socket.emit('profile', {
                            status: false,
                            message: err
                        });
                    });
            } else {
                socket.emit('profile', {
                    status: false
                });
            }
        });
    });
};
