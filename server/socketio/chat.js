var Responses = require('../responses/socketio/index.js');

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('chat', function(data) {
            if (
                data instanceof Object &&
                'message' in data &&
                'channel' in data
            ) {
                socket.broadcast.emit('chat', {
                    status: true,
                    channel: data.channel,
                    message: data.message
                });
            } else {
                socket.emit('status', {
                    status: false,
                    message: Responses.INVALID_MESSAGE
                });
            }
        });
    });
};
