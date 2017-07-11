var router = require('express').Router(),
    authMiddleware = require('../../middleware/auth.js'),
    User = require('../../db/model/User.js'),
    Application = require('../../db/model/Application.js');

router.get('/', authMiddleware('sponsor admin', 'web'), function(req, res) {
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
                            res.render('sponsor', {
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
