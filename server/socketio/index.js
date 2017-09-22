var rateLimiter = require('./ratelimiter.js'),
    authMiddleware = require('./auth.js'),
    userMiddleware = require('./user.js'),
    chatMiddleware = require('./chat.js'),
    channelMiddleware = require('./channel.js');

module.exports = function(io) {
    rateLimiter(io);
    authMiddleware(io, 'any');
    userMiddleware(io);
    channelMiddleware(io);
    chatMiddleware(io);
};
