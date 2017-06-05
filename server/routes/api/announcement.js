var router = require('express').Router(),
    Announcement = require('../../db/model/Announcement.js'),
    Responses = require('../../responses/api/announcement.js');

function sortByDate(a,b) {
    return new Date(b.broadcastTime) - new Date(a.broadcastTime);
};

router.get('/', function(req, res) {
    if (req.session.loggedIn && req.session.can_edit_announcement) {
        Announcement.find()
            .exec()
            .then(announcements => {
                announcements.sort(sortByDate);
                res.send(announcements);
                console.log(announcements);
            })
            .catch(err => {
                console.error(err);
            });
    }
    else {
        Announcement.find()
            //.byIsPublic()
            .exec()
            .then(announcements => {
                announcements.sort(sortByDate);
                res.send(announcements);
                console.log(announcements);
            })
            .catch(err => {
                console.error(err);
            });
    }
});

router.post('/', function(req, res) {
    if (true || req.session.loggedIn && req.session.can_edit_announcement) {
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
    //update announcement conforming to PUT or PATCH semantics
    if (true || req.session.loggedIn && req.session.can_edit_announcement) {
        if (req.body.title) {
            Announcement.update({
                title: req.body.title
            }, {
                title: req.body.title,
                body: req.body.body,
                broadcastTime: req.body.broadcastTime,
                category: req.body.category,
                isApproved: req.body.isApproved,
                isSent: req.body.isSent
            }, function (err, raw) {
                if (err) {
                    console.log('wut', raw);
                } else {
                    res.send({
                        status: true
                    });
                }
            });
        } else {
            res.status(401).send({
                status: false,
                message: Responses.PARAMS_NOT_FOUND
            });
        }
    }
});

router.patch('/', function(req, res) {
    //update announcement conforming to PUT or PATCH semantics
    res.send('patch');
});

module.exports = router;
