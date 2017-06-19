var Responses = require('../responses/socketio/index.js'),
    config = require('../../config/default.js'),
    FastRateLimit = require('fast-ratelimit').FastRateLimit,
    socketLimiter = new FastRateLimit({
        threshold: config.socket_messages_threshold,
        ttl: config.socket_messages_ttl
    });

module.exports = function(io) {
    io.use(function(socket, next) {
        socket.use(function(socketEvent, socketNext) {
            socketLimiter
                .consume(socket.id)
                .then(() => {
                    socketNext();
                })
                .catch(() => {
                    socket.emit('status', {
                        status: false,
                        message: Responses.RATE_LIMIT
                    });
                    socket.disconnect();
                });
        });
        next();
    });
};
