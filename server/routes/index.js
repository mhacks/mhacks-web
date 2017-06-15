var router = require('express').Router(),
    authMiddleware = require('../middleware/auth.js'),
    User = require('../db/model/User.js'),
    Application = require('../db/model/Application.js'),
    path = require('path');

router.get('/chat', function(req, res) {
    res.sendFile(path.resolve('server/views/chat.html'));
});

router.get('/admin', authMiddleware('admin', 'web'), function(req, res) {
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
                            res.render('admin', {
                                user: User,
                                application: Application,
                                users: users,
                                applications: applications,
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
});

module.exports = router;
