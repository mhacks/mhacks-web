var router = require('express').Router(),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    qrcode = require('../../interactors/qr.js'),
    ScanEvent = require('../../db/model/ScanEvent.js'),
    Scan = require('../../db/model/Scan.js');

router.get('/', authMiddleware('admin', 'api'), function(req, res) {
    Scan.find({})
        .exec()
        .then(scans => {
            res.send({
                status: true,
                scans: scans
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

router.post('/', authMiddleware('admin', 'api'), function(req, res) {
    if (
        !req.body.id &&
        req.body.type &&
        req.body.notes &&
        req.body.count &&
        req.body.name &&
        req.body.public
    ) {
        Scan.create({
            type: req.body.type,
            notes: req.body.notes,
            creator: req.user,
            count: req.body.count,
            name: req.body.name,
            public: req.body.public
        })
            .then(scan => {
                res.send({
                    status: true,
                    scan: scan
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    } else if (
        req.body.id &&
        req.body.type &&
        req.body.notes &&
        req.body.count &&
        req.body.name &&
        req.body.public
    ) {
        Scan.updateOne({ _id: req.body.id }, req.body, {
            runValidators: true
        })
            .then(scan => {
                res.send({
                    status: true,
                    scan: scan
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    } else {
        res.status(400).send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
    }
});

router.get('/image/:id', authMiddleware('admin', 'api'), function(req, res) {
    res.set('Content-Type', 'image/png');
    qrcode.writeQRCodeToStream(req.params.id, res);
});

router.get('/:id', authMiddleware('any', 'api'), function(req, res) {
    if (req.params.id) {
        Scan.findOne({ _id: req.params.id })
            .exec()
            .then(scan => {
                if (scan) {
                    res.redirect('/scan/' + req.params.id);
                } else {
                    res.redirect('/');
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    } else {
        res.redirect('/');
    }
});

router.post('/:id', authMiddleware('any', 'api'), function(req, res) {
    if (req.params.id) {
        Scan.findOne({ _id: req.params.id })
            .exec()
            .then(scan => {
                ScanEvent.findOne({ user: req.user, type: scan })
                    .exec()
                    .then(scanevent => {
                        if (scanevent) {
                            res.send({
                                status: true,
                                scanevent: scanevent
                            });
                        } else {
                            if (scan.count < scan.max_count) {
                                ScanEvent.create({
                                    user: req.user,
                                    scanner: req.user,
                                    event: scan
                                })
                                    .then(scanevent => {
                                        res.send({
                                            status: true,
                                            scanevent: scanevent
                                        });
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        res.status(500).send({
                                            status: false,
                                            message: Responses.UNKNOWN_ERROR
                                        });
                                    });

                                scan.count++;
                                scan.save();
                            } else {
                                res.status(400).send({
                                    status: false,
                                    message: Responses.Scan.TOO_MANY_VALIDATIONS
                                });
                            }
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send({
                            status: false,
                            message: Responses.UNKNOWN_ERROR
                        });
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    } else {
        res.status(400).send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
    }
});

module.exports = router;
