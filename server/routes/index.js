var router = require('express').Router(),
    path = require('path'),
    portalHandler = require('./portal.js');

router.get('/logo.png', function(req, res) {
    res.sendFile(path.join(__dirname, '../../build/logo.png'));
});

router.get('/logo-title.png', function(req, res) {
    res.sendFile(path.join(__dirname, '../../build/logo-title.png'));
});

router.use('/portal', portalHandler);

module.exports = router;
