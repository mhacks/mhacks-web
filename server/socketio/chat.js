var Responses = require('../responses/socketio/index.js');

module.exports = function(io) {
    io.on('connection', function(socket) {
        chatHandler(io, socket);
    });
};

function chatHandler(io, socket) {
    if (socket.handshake && socket.handshake.authToken) {
        socket.join('#general');

        socket.on('channels', function() {
            sendChannels(io, socket);
        });

        socket.on('chat', function(data) {
            if (
                data instanceof Object &&
                'message' in data &&
                'channel' in data
            ) {
                if (
                    data.channel in io.sockets.adapter.rooms &&
                    userInChannel(io, data.channel, socket.handshake.email)
                ) {
                    io.sockets.in(data.channel).emit('chat', {
                        status: true,
                        message: data.message,
                        channel: data.channel,
                        user: {
                            name: socket.handshake.name,
                            email: socket.handshake.email
                        }
                    });
                } else {
                    socket.emit('status', {
                        status: false,
                        message: Responses.INVALID_MESSAGE
                    });
                }
            } else {
                socket.emit('status', {
                    status: false,
                    message: Responses.INVALID_MESSAGE
                });
            }
        });

        socket.on('new-chat', function(data) {
            if (data instanceof Object && 'users' in data) {
                var newChannelName = '';

                if (data.users.length > 0) {
                    var thisUser = socket.handshake.email;
                    if (data.users.indexOf(thisUser) === -1) {
                        data.users.push(thisUser);
                    }

                    data.users.forEach(function(user, elem) {
                        var channelName = getUserChannelName(io, user);
                        if (channelName) {
                            newChannelName +=
                                channelName +
                                (elem < data.users.length - 1 ? '+' : '');
                        }
                    });
                }

                newChannelName.split('+').forEach(function(name) {
                    if (name in io.sockets.sockets) {
                        io.sockets.sockets[name].join(newChannelName);
                    }
                });

                sendChannelsToAll(io);
            }
        });

        sendChannelsToAll(io);
        socket.on('disconnect', function() {
            sendChannelsToAll(io);
        });
    } else {
        setTimeout(function() {
            chatHandler(io, socket);
        }, 1000);
    }
}

function sendChannelsToAll(io) {
    for (var roomName in io.sockets.sockets) {
        sendChannels(io, io.sockets.sockets[roomName]);
    }
}

function getUserChannelName(io, user) {
    for (var roomName in io.sockets.sockets) {
        if (io.sockets.sockets[roomName].handshake.email === user) {
            return roomName;
        }
    }
    return false;
}

function sendChannels(io, socket) {
    var channels = [];

    for (var roomName in io.sockets.adapter.rooms) {
        if (
            userInChannel(io, roomName, socket.handshake.email) ||
            (socket.handshake.groups &&
                socket.handshake.groups.indexOf('admin') !== -1)
        ) {
            var channelObj = {
                name: roomName,
                members: getChannelMembers(io, roomName)
            };

            var userChannel = isUserChannel(io, roomName);
            if (userChannel) {
                channelObj.user = userChannel;
            }

            channels.push(channelObj);
        }
    }

    socket.emit('channels', {
        status: true,
        channels: channels
    });
}

function isUserChannel(io, roomName) {
    var roomNameParts = roomName.split('+');
    if (roomNameParts.length > 1) {
        var user = [];
        roomNameParts.forEach(function(data) {
            user.push(isUserChannel(io, data));
        });

        return user;
    } else {
        if (roomName in io.sockets.sockets) {
            return io.sockets.sockets[roomName].handshake.email;
        } else {
            return false;
        }
    }
}

function getChannelMembers(io, channel) {
    var channelMembers = {};

    if (channel in io.sockets.adapter.rooms) {
        for (var s in io.sockets.adapter.rooms[channel].sockets) {
            var sock = io.sockets.sockets[s];
            channelMembers[sock.handshake.email] = {
                name: sock.handshake.name,
                email: sock.handshake.email
            };
        }
    }

    return channelMembers;
}

function userInChannel(io, channel, user) {
    var channelMembers = getChannelMembers(io, channel);

    return user in channelMembers;
}
