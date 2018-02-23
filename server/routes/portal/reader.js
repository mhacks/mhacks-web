var router = require('express').Router(),
    authMiddleware = require('../../middleware/auth.js'),
    User = require('../../db/model/User.js'),
    Application = require('../../db/model/Application.js');

router.get('/', authMiddleware('reader admin', 'web'), function(req, res) {
    User.find()
        .byToken(req.authToken)
        .then(user => {
            User.find()
                .then(users => {
                    Application.find()
                        .then(applications => {
                            res.render('reader', {
                                application: Application,
                                applications: applications,
                                users: users,
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
