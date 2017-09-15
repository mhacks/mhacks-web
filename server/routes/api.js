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
    formHandler = require('./api/form.js'),
    readerHandler = require('./api/reader.js'),
    adminHandler = require('./api/admin.js'),
    pushHandler = require('./api/push.js'),
    scanHandler = require('./api/scan.js'),
    locationHandler = require('./api/location.js'),
    eventHandler = require('./api/event.js'),
    sponsorHandler = require('./api/sponsor.js'),
    mentorHandler = require('./api/mentor.js'),
    teamHandler = require('./api/team.js'),
    floorHandler = require('./api/floor.js'),
    speakerHandler = require('./api/speaker.js'),
    mentorshipHandler = require('./api/mentorship.js'),
    deviceHandler = require('./api/device.js'),
    swaggerUI = require('swagger-ui-express'),
    swaggerDoc = require('../../static/docs/openapi.json');

router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
router.use('/auth', authHandler);
router.use('/email', emailHandler);
router.use('/announcements', announcementHandler);
router.use('/user', authMiddleware('any', 'api', false), userHandler);
router.use('/application', authMiddleware('any', 'api'), applicationHandler);
router.use('/deploy', deployHandler);
router.use('/artifact', artifactHandler);
router.use('/configuration', configurationHandler);
router.use('/form', formHandler);
router.use('/shortener', shortenerHandler);
router.use('/admin', authMiddleware('admin', 'api'), adminHandler);
router.use('/reader', authMiddleware('admin reader', 'api'), readerHandler);
router.use('/push', pushHandler);
router.use('/scan', scanHandler);
router.use('/sponsor', sponsorHandler);
router.use('/location', locationHandler);
router.use('/event', eventHandler);
router.use('/mentor', mentorHandler);
router.use('/floor', floorHandler);
router.use('/speaker', speakerHandler);
router.use('/teams', authMiddleware('any', 'api', false), teamHandler);
router.use('/mentorship', mentorshipHandler);
router.use('/device', deviceHandler);

router.get('/', function(req, res) {
    res.redirect('/v1/docs');
});

module.exports = router;
