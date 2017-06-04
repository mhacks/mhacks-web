var router = require('express').Router(),
    Announcements = require('../../db/model/Announcement.js'),
    Responses = require('../../responses/api/announcement.js');

function sortByDate(a,b) {
    return new Date(b.broadcastTime) - new Date(a.broadcastTime);
};

router.get('/', function(req, res) {
    if (req.session.loggedIn && req.session.can_edit_announcement) {
        Announcements.find()
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
        Announcements.find()
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
    // if user doesn't have permission or if fields aren't there: reject with appropriate status and message
    // if user has permission ^:
    // create new announcement with the fields in HTTP body
    if (req.session.loggedIn && req.session.can_edit_announcement) {
        if (req.body.title && req.body.body && req.body.category) {
            Announcements.create({
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

router.put('/', function(req, res) {
    //update announcement conforming to PUT or PATCH semantics
    res.send('put');
});

router.patch('/', function(req, res) {
    //update announcement conforming to PUT or PATCH semantics
    res.send('patch');
});

module.exports = router;
