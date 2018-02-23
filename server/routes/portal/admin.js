var router = require('express').Router(),
    authMiddleware = require('../../middleware/auth.js'),
    User = require('../../db/model/User.js'),
    Application = require('../../db/model/Application.js'),
    Announcement = require('../../db/model/Announcement.js'),
    Shortener = require('../../db/model/Shortener.js');

router.get('/', authMiddleware('admin', 'web'), function(req, res) {
    User.find()
        .byToken(req.authToken)
        .then(user => {
            User.find()
                .then(users => {
                    Application.find()
                        .then(applications => {
                            Announcement.find()
                                .then(announcements => {
                                    Shortener.find()
                                        .then(shorteners => {
                                            res.render('admin', {
                                                user: User,
                                                application: Application,
                                                announcement: Announcement,
                                                shortener: Shortener,
                                                users: users,
                                                applications: applications,
                                                announcements: announcements,
                                                shorteners: shorteners,
                                                currentUser: user
                                            });
                                        })
                                        .catch(err => {
                                            console.error(err);

                                            res.send({
                                                status: false,
                                                message: err
                                            });
                                        });
                                })
                                .catch(err => {
                                    console.error(err);

                                    res.send({
                                        status: false,
                                        message: err
                                    });
                                });
                        })
                        .catch(err => {
                            console.error(err);

                            res.send({
                                status: false,
                                message: err
                            });
                        });
                })
                .catch(err => {
                    console.error(err);

                    res.send({
                        status: false,
                        message: err
                    });
                });
        })
        .catch(err => {
            console.error(err);

            res.send({
                status: false,
                message: err
            });
        });
});

module.exports = router;
