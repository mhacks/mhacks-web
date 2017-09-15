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

function joinChannels(io, socket) {
    Channel.find()
        .byMember(socket.handshake.user)
        .exec()
        .then(channels => {
            channels.forEach(function(channel) {
                if (Object.keys(socket.rooms).indexOf(channel._id) === -1) {
                    socket.join(channel._id);

                    Chat.getEntries(channel._id).then((response) => {
                        console.log(response);
                        response.hits.hits.forEach(function (hit) {
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
                    }).catch(console.error);
                }
            });
        })
        .catch(err => {
            socket.emit('status', {
                status: false,
                message: err
            });
        });
}

function joinPrivateMessages(io, socket) {
    PrivateMessage.find()
        .byMember(socket.handshake.user)
        .exec()
        .then(privatemessages => {
            privatemessages.forEach(function(privatemessage) {
                if (Object.keys(socket.rooms).indexOf(privatemessage._id) === -1) {
                    socket.join(privatemessage._id);

                    Chat.getEntries(privatemessage._id).then((response) => {
                        console.log(response);
                        response.hits.hits.forEach(function (hit) {
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
                    }).catch(console.error);
                }
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
                        ids = [];

                    all.forEach(function(channel) {
                        ids.push(channel._id);
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
        })
        .catch(err => {
            socket.emit('status', {
                status: false,
                message: err
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
                channels: privatemessages
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
            joinChannels(io, io.sockets.sockets[socketName]);
            joinPrivateMessages(io, io.sockets.sockets[socketName]);
            leaveRooms(io, io.sockets.sockets[socketName]);
        }
    }
}
