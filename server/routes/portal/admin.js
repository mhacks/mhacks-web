var router = require('express').Router(),
    authMiddleware = require('../../middleware/auth.js'),
    User = require('../../db/model/User.js'),
    Application = require('../../db/model/Application.js'),
    Announcement = require('../../db/model/Announcement.js'),
    Shortener = require('../../db/model/Shortener.js');

router.get('/', authMiddleware('admin', 'web'), function(req, res) {
    User.find()
        .byToken(req.authToken)
        .exec()
        .then(user => {
            User.find()
                .exec()
                .then(users => {
                    Application.find()
                        .exec()
                        .then(applications => {
                            Announcement.find()
                                .exec()
                                .then(announcements => {
                                    Shortener.find()
                                        .exec()
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
