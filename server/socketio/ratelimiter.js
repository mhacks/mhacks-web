var Responses = require('../responses/socketio/index.js'),
    FastRateLimit = require('fast-ratelimit').FastRateLimit,
    socketLimiter = new FastRateLimit({
        threshold: 3,
        ttl: 1
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
