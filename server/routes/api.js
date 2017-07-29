var router = require('express').Router(),
    authHandler = require('./api/auth.js'),
    emailHandler = require('./api/email.js'),
    userHandler = require('./api/user.js'),
    announcementHandler = require('./api/announcement.js'),
    applicationHandler = require('./api/application.js'),
    configurationHandler = require('./api/configuration.js'),
    shortenerHandler = require('./api/shortener.js'),
    deployHandler = require('./api/deploy.js'),
    authMiddleware = require('../middleware/auth.js'),
    artifactHandler = require('./api/artifact.js'),
    readerHandler = require('./api/reader.js'),
    adminHandler = require('./api/admin.js');

router.use('/auth', authHandler);
router.use('/email', emailHandler);
router.use('/announcements', announcementHandler);
router.use('/user', authMiddleware('any', 'api', false), userHandler);
router.use('/application', authMiddleware('any', 'api'), applicationHandler);
router.use('/deploy', deployHandler);
router.use('/artifact', artifactHandler);
router.use('/configuration', configurationHandler);
router.use('/shortener', shortenerHandler);
router.use('/admin', authMiddleware('admin', 'api'), adminHandler);
router.use('/reader', authMiddleware('admin reader', 'api'), readerHandler);

router.get('/', function(req, res) {
    res.send('API');
});

module.exports = router;
