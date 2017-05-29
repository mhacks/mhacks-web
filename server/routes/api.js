var router = require('express').Router(),
    authHandler = require('./api/auth.js'),
    emailHandler = require('./api/email.js'),
    userHandler = require('./api/user.js'),
    announcementHandler = require('./api/announcement.js'),
    authMiddleware = require('../middleware/auth.js');

router.use('/auth', authHandler);
router.use('/email', emailHandler);
router.use('/user', authMiddleware('api'), userHandler);
router.use('/announcements', announcementHandler);

router.get('/', function(req, res) {
    res.send('API');
});

module.exports = router;
