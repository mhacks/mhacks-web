const Responses = require('../responses/socketio/index.js'),
    Channel = require('../db/model/Channel.js'),
    PrivateMessage = require('../db/model/PrivateMessage.js'),
    User = require('../db/model/User.js'),
    Chat = require('../db/elasticsearch/chat.js');

module.exports = function(io) {
    io.on('connection', function(socket) {
        channelHandler(io, socket);
    });

    setInterval(function() {
        interval(io);
    }, 250);

    setInterval(function() {
        addUsers();
    }, 1000);
};

function channelHandler(io, socket) {
    if (socket.handshake && socket.handshake.authToken) {
        socket.on('channels', function() {
            sendChannels(io, socket);
        });

        socket.on('privatemessages', function() {
            sendPrivateMessages(io, socket);
        });

        socket.on('privatemessage', function(data) {
            if (data && 'members' in data) {
                createPrivateMessage(io, socket, data);
            }
        });

        socket.on('disconnect', function() {
            if (socket.handshake.user && socket.handshake.user.online) {
                socket.handshake.user.online = false;
                socket.handshake.user.save();
            }
        });
    } else {
        setTimeout(function() {
            channelHandler(io, socket);
        }, 1000);
    }
}

function joinRooms(io, socket) {
    Channel.find()
        .byMember(socket.handshake.user)
        .exec()
        .then(channels => {
            PrivateMessage.find()
                .byMember(socket.handshake.user)
                .exec()
                .then(privatemessages => {
                    var all = privatemessages.concat(channels);

                    all.forEach(function(channel) {
                        if (
                            Object.keys(socket.rooms).indexOf(channel.id) === -1
                        ) {
                            socket.join(channel.id);

                            Chat.getEntries(channel.id)
                                .then(response => {
                                    response.hits.hits
                                        .reverse()
                                        .forEach(function(hit) {
                                            var data = hit._source;

                                            socket.emit('chat', {
                                                status: true,
                                                message: data.message,
                                                channel: data.channel,
                                                time: data.time,
                                                user: {
                                                    name: data.user.name
                                                }
                                            });
                                        });
                                })
                                .catch(console.error);
                        }
                    });
                })
                .catch(err => {
                    socket.emit('status', {
                        status: false,
                        message: err
                    });
                });
        })
        .catch(err => {
            socket.emit('status', {
                status: false,
                message: err
            });
        });
}

function leaveRooms(io, socket) {
    Channel.find()
        .byMember(socket.handshake.user)
        .exec()
        .then(channels => {
            PrivateMessage.find()
                .byMember(socket.handshake.user)
                .exec()
                .then(privatemessages => {
                    var all = privatemessages.concat(channels),
                        ids = all.map(function(channel) {
                            return channel.id;
                        });

                    Object.keys(socket.rooms).forEach(function(room) {
                        if (ids.indexOf(room) === -1 && room !== socket.id) {
                            socket.leave(room);
                        }
                    });
                })
                .catch(err => {
                    socket.emit('status', {
                        status: false,
                        message: err
                    });
                });
        })
        .catch(err => {
            socket.emit('status', {
                status: false,
                message: err
            });
        });
}

function sendChannels(io, socket) {
    Channel.find()
        .byMemberOrJoinable(socket.handshake.user, true)
        .populate('members.user', 'full_name _id avatars online')
        .exec()
        .then(channels => {
            socket.emit('channels', {
                status: true,
                channels: channels
            });
        });
}

function sendPrivateMessages(io, socket) {
    PrivateMessage.find()
        .byMember(socket.handshake.user)
        .populate('members.user', 'full_name _id avatars online')
        .exec()
        .then(privatemessages => {
            socket.emit('privatemessages', {
                status: true,
                privatemessages: privatemessages
            });
        })
        .catch(err => {
            socket.emit('status', {
                status: false,
                message: err
            });
        });
}

function createPrivateMessage(io, socket, data) {
    if (data && 'members' in data && Array.isArray(data.members)) {
        const query = [];
        let user_is_member = false;

        data.members.forEach(function(member) {
            if (member._id === socket.handshake.user._id) {
                user_is_member = true;
            }

            query.push({ _id: member._id });
        });

        if (!user_is_member) {
            data.members.push({ _id: socket.handshake.user._id });
            query.push({ _id: socket.handshake.user._id });
        }

        User.find({
            $or: query
        })
            .exec()
            .then(users => {
                if (users.length === data.members.length) {
                    const members = [];

                    users.forEach(function(user) {
                        members.push({
                            user: user
                        });
                    });

                    PrivateMessage.create({
                        creator: socket.handshake.user,
                        members: members
                    });
                } else {
                    socket.emit('status', {
                        status: false,
                        message: Responses.MEMBERS_NOT_FOUND
                    });
                }
            });
    }
}

function interval(io) {
    for (const socketName in io.sockets.sockets) {
        if (io.sockets.sockets.hasOwnProperty(socketName)) {
            joinRooms(io, io.sockets.sockets[socketName]);
            leaveRooms(io, io.sockets.sockets[socketName]);
        }
    }
}

function addUsers() {
    Channel.find({
        all_users: true
    })
        .exec()
        .then(channels => {
            User.find()
                .exec()
                .then(users => {
                    for (var channel of channels) {
                        if (
                            users.length !== channel.members.length &&
                            channel.all_users
                        ) {
                            var notFoundUsers = [];

                            for (var user of users) {
                                var foundUser = false;

                                for (var member of channel.members) {
                                    if (member.user === user._id) {
                                        foundUser = true;
                                        break;
                                    }
                                }

                                if (!foundUser) {
                                    notFoundUsers.push(user);
                                }
                            }

                            notFoundUsers.forEach(function(user) {
                                channel.members.push({
                                    user: user
                                });
                            });

                            channel.save();
                        }
                    }
                });
        });
}
