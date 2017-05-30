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
                            var groups = [];

                            user.groups.forEach(function(data) {
                                groups.push(data.name);
                            });

                            socket.emit('profile', {
                                status: true,
                                user: {
                                    email: user.email,
                                    full_name: user.full_name,
                                    birthday: user.birthday,
                                    groups: groups
                                }
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
