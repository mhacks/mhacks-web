var router = require('express').Router(),
    Announcements = require('../../db/model/Announcement.js');

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
            .byIsPublic()
            .beforeNow()
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

module.exports = router;
