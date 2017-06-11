var router = require('express').Router(),
    Responses = require('../../responses/api'),
    User = require('../../db/model/User.js');

// Handles /v1/user/profile
router.get('/profile', function(req, res) {
    User.find()
        .byToken(req.authToken)
        .exec()
        .then(user => {
            var groups = [];

            user.groups.forEach(function(data) {
                groups.push(data.name);
            });

            res.send({
                status: true,
                user: {
                    email: user.email,
                    email_verified: user.email_verified,
                    full_name: user.full_name,
                    birthday: user.birthday,
                    groups: groups
                }
            });
        })
        .catch(() => {
            res.send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

router.post('/profile', function(req, res) {
    res.send({
        status: true
    });
});

module.exports = router;
