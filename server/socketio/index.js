var authMiddleware = require('./auth.js');

module.exports = function(io) {
    io.of('/').use(authMiddleware('any', 'socket'));
};
