var router = require('express').Router(),
    authHandler = require('./api/auth.js'),
    authMiddleware = require('../middleware/auth.js');

router.use('/auth', authHandler);

router.get('/', function(req, res) {
    res.send('API');
});

module.exports = router;