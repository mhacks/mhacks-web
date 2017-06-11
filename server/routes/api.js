var router = require('express').Router(),
    authHandler = require('./api/auth.js'),
    emailHandler = require('./api/email.js'),
    userHandler = require('./api/user.js'),
    applicationHandler = require('./api/application.js'),
    deployHandler = require('./api/deploy.js'),
    authMiddleware = require('../middleware/auth.js'),
    artifactHandler = require('./api/artifact.js');

router.use('/auth', authHandler);
router.use('/email', emailHandler);
router.use('/user', authMiddleware('any', 'api', false), userHandler);
router.use('/application', authMiddleware('any', 'api'), applicationHandler);
router.use('/deploy', deployHandler);
router.use('/artifact', artifactHandler);

router.get('/', function(req, res) {
    res.send('API');
});

module.exports = router;
