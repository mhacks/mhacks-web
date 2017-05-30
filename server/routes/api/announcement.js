var router = require('express').Router(),
    Announcements = require('../../db/model/Announcement.js');

router.get('/', function(req, res) {
    if (req.session.loggedIn && req.session.can_edit_announcement) {
        Announcements.find()
            .byBroadcastTime(new Date("Sun, 28 Mar 2017 02:30:00 GMT"), Date.now())
            .exec()
            .then(announcements => {
                announcements.sort();
                res.send(announcements);
                console.log(announcements);
            })
            .catch(err => {
                console.error(err);
            });
    }
    else {
        Announcements.find()
            .byBroadcastTime(new Date("Sun, 28 Mar 2017 02:30:00 GMT"), Date.now())
            .byIsApproved()
            .exec()
            .then(announcements => {
                res.send(announcements);
                console.log(announcements);
            })
            .catch(err => {
                console.error(err);
            });
    }
});

module.exports = router;
