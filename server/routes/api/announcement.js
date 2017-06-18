var router = require('express').Router(),
    Announcement = require('../../db/model/Announcement.js'),
    Responses = require('../../responses/api/announcement.js');

function sortByDate(a, b) {
    return new Date(b.broadcastTime) - new Date(a.broadcastTime);
}

// Handles get requests for /v1/announcements
router.get('/', function(req, res) {
    if (req.session.loggedIn && req.session.can_edit_announcement) {
        Announcement.find()
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
    } else {
        Announcement.find()
            .byIsPublic()
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
    }
});

router.post('/', function(req, res) {
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

router.put('/', function(req, res) {
    if (req.session.loggedIn && req.session.can_edit_announcement) {
        if (req.body.id) {
            Announcement.findById(req.body.id)
                .exec()
                .then(announcement => {
                    announcement.title = req.body.title;
                    announcement.body = req.body.body;
                    announcement.broadcastTime = req.body.broadcastTime;
                    announcement.category = req.body.category;
                    announcement.isApproved = req.body.isApproved;
                    announcement.isSent = req.body.isSent;
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

router.patch('/', function(req, res) {
    if (req.session.loggedIn && req.session.can_edit_announcement) {
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
