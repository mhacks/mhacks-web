var Responses = require('../responses/socketio/index.js'),
    Channel = require('../db/model/Channel.js'),
    PushNotification = require('../db/model/PushNotification.js'),
    Device = require('../db/model/Device.js'),
    config = require('../../config/default.js'),
    Chat = require('../db/elasticsearch/chat.js'),
    PrivateMessage = require('../db/model/PrivateMessage.js');

module.exports = function(io) {
    io.on('connection', function(socket) {
        chatHandler(io, socket);
    });
};

function chatHandler(io, socket) {
    if (socket.handshake && socket.handshake.authToken) {
        socket.on('chat', function(data) {
            if ('message' in data && 'channel' in data) {
                if (Object.keys(socket.rooms).indexOf(data.channel) !== -1) {
                    Channel.findById(data.channel)
                        .exec()
                        .then(channel => {
                            if (!channel) {
                                PrivateMessage.findById(data.channel)
                                    .exec()
                                    .then(channel => {
                                        handleChannel(
                                            data,
                                            channel,
                                            io,
                                            socket
                                        );
                                    });
                            } else {
                                handleChannel(data, channel, io, socket);
                            }
                        });
                } else {
                    socket.emit('status', {
                        status: false,
                        message: Responses.INVALID_MESSAGE
                    });
                }
            }
        });
    } else {
        setTimeout(function() {
            chatHandler(io, socket);
        }, 1000);
    }
}

function handleChannel(data, channel, io, socket) {
    var users = [],
        messageSent = false;

    channel.members.forEach(function(user_info) {
        if (
            user_info.user.toString() === socket.handshake.user._id.toString()
        ) {
            if (!user_info.muted) {
                messageSent = true;

                io.sockets.in(data.channel).emit('chat', {
                    status: true,
                    message: data.message,
                    channel: data.channel,
                    time: new Date().getTime(),
                    user: {
                        name: socket.handshake.name
                    }
                });

                if (config.store_chat_messages) {
                    Chat.createEntry(socket.handshake.user, data);
                }
            } else {
                socket.emit('status', {
                    status: false,
                    message: Responses.MUTED
                });
            }
        } else {
            users.push(user_info.user);
        }
    });

    if (messageSent) {
        Device.find({ user: { $in: users } })
            .exec()
            .then(devices => {
                var device_ids = devices.map(function(device) {
                    return device._id;
                });

                PushNotification.create({
                    title: 'MHacks Chat: ' + socket.handshake.name,
                    body: data.message,
                    category: 'chat',
                    isApproved: true,
                    devices: device_ids
                });
            });
    }
}
