var router = require('express').Router(),
    authHandler = require('./api/auth.js'),
    emailHandler = require('./api/email.js');

router.use('/auth', authHandler);
router.use('/email', emailHandler);

router.get('/', function(req, res) {
    res.send('API');
});

module.exports = router;
