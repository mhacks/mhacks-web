var router = require('express').Router(),
    validator = require('validator'),
    Responses = require('../../responses/api'),
    User = require('../../db/model/User.js');

router.post('/profile', function(req, res) {
    User.find()
        .byToken(req.authToken)
        .exec()
        .then(user => {
            var updateable_fields = ['full_name', 'email', 'password', 'profile_picture', 'birthday', 'university', 'major', 'resume'];
            var fields = {};
            var sendVerificationEmail = false;

            // Add handlers for s3 upload of profile picture and resume

            for (var i in req.body) {
                if (i === 'email') {
                    if (!validator.isEmail(req.body.email)) {
                        continue;
                    } else {
                        sendVerificationEmail = true;
                    }
                }

                if (updateable_fields.indexOf(i) !== -1) {
                    fields[i] = req.body[i];
                }
            }

            user.updateFields(fields);

            if (sendVerificationEmail) {
                user.sendVerificationEmail();
            }

            res.send({
                status: false,
                message: fields
            });
        })
        .catch(() => {
            res.send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

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

module.exports = router;
