var router = require('express').Router(),
    Announcement = require('../../db/model/Announcement.js'),
    authMiddleware = require('../../middleware/auth.js'),
    Responses = require('../../responses/api/announcement.js'),
    PushNotification = require('../../db/model/PushNotification.js');

function sortByDate(a, b) {
    return new Date(b.broadcastTime) - new Date(a.broadcastTime);
}

// Handles get requests for /v1/announcements
router.get('/', function(req, res) {
    authMiddleware('admin', 'api', true, function() {
        Announcement.find()
            .byIsPublic(req.query.since)
            .exec()
            .then(announcements => {
                announcements.sort(sortByDate);

                res.send({
                    status: true,
                    announcements: announcements
                });
            })
            .catch(err => {
                console.error(err);
                res.send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    })(req, res, function() {
        Announcement.find()
            .since(req.query.since)
            .exec()
            .then(announcements => {
                announcements.sort(sortByDate);
                res.send({
                    status: true,
                    announcements: announcements
                });
            })
            .catch(err => {
                console.error(err);
                res.send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    });
});

router.post('/', authMiddleware('admin', 'api'), function(req, res) {
    if (req.session.loggedIn) {
        if (req.body.title && req.body.body && req.body.category) {
            Announcement.create({
                title: req.body.title,
                body: req.body.body,
                broadcastTime: req.body.broadcastTime,
                category: req.body.category,
                isApproved: req.body.isApproved,
                isSent: req.body.isSent
            })
                .then(announcement => {
                    if (req.body.push) {
                        PushNotification.create({
                            title: announcement.title,
                            body: announcement.body,
                            category: announcement.category,
                            isApproved: announcement.isApproved,
                            broadcastTime: announcement.broadcastTime
                        });
                    }

                    res.send({
                        status: true,
                        announcement: announcement
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
            res.status(401).send({
                status: false,
                message: Responses.PARAMS_NOT_FOUND
            });
        }
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PERMISSIONS_REQUIRED
        });
    }
});

router.delete('/:id', authMiddleware('admin', 'api'), function(req, res) {
    if (req.params.id) {
        Announcement.findById(req.params.id)
            .then(announcement => {
                announcement.deleted = true;
                announcement.save();

                res.send({
                    status: true,
                    announcement: announcement
                });
            })
            .catch(err => {
                res.status(500).send({
                    status: false,
                    message: err
                });
            });
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PARAMS_NOT_FOUND
        });
    }
});

router.put('/', authMiddleware('admin', 'api'), function(req, res) {
    if (req.session.loggedIn) {
        if (req.body.id) {
            Announcement.findById(req.body.id)
                .exec()
                .then(announcement => {
                    announcement.title = req.body.title || announcement.title;
                    announcement.body = req.body.body || announcement.body;
                    announcement.broadcastTime =
                        req.body.broadcastTime || announcement.broadcastTime;
                    announcement.category =
                        req.body.category || announcement.category;
                    announcement.isApproved =
                        req.body.isApproved || announcement.isApproved;
                    announcement.isSent =
                        req.body.isSent || announcement.isSent;
                    announcement.save();
                    res.send({
                        status: true
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
            res.status(401).send({
                status: false,
                message: Responses.PARAMS_NOT_FOUND
            });
        }
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PERMISSIONS_REQUIRED
        });
    }
});

router.patch('/', authMiddleware('admin', 'api'), function(req, res) {
    if (req.session.loggedIn) {
        if (req.body.id) {
            Announcement.updateOne({ _id: req.body.id }, req.body, {
                runValidators: true
            })
                .then(() => {
                    res.send({
                        status: true
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
            res.status(401).send({
                status: false,
                message: Responses.PARAMS_NOT_FOUND
            });
        }
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PERMISSIONS_REQUIRED
        });
    }
});

module.exports = router;
