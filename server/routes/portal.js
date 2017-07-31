var router = require('express').Router(),
    adminHandler = require('./portal/admin.js'),
    sponsorHandler = require('./portal/sponsor.js'),
    readerHandler = require('./portal/reader.js');

router.use('/admin', adminHandler);
router.use('/sponsor', sponsorHandler);
router.use('/reader', readerHandler);

module.exports = router;
