var rateLimiter = require('./ratelimiter.js'),
    authMiddleware = require('./auth.js'),
    userMiddleware = require('./user.js'),
    chatMiddleware = require('./chat.js');

module.exports = function(io) {
    rateLimiter(io);
    authMiddleware(io, 'any');
    userMiddleware(io);
    chatMiddleware(io);
};
