var router = require('express').Router(),
    validator = require('validator'),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    User = require('../../db/model/User.js'),
    config = require('../../../config/default.js'),
    uploadHelper = require('../../interactors/multer-s3.js')(
        config.AWS_BUCKET_NAME
    );

router.post(
    '/profile',
    authMiddleware('any', 'api', true),
    uploadHelper.fields([{ name: 'avatar' }, { name: 'resume' }]),
    function(req, res) {
        User.find()
            .byToken(req.authToken)
            .exec()
            .then(user => {
                var updateable_fields = [
                    'full_name',
                    'email',
                    'password',
                    'avatar',
                    'birthday',
                    'university',
                    'major',
                    'resume'
                ];
                var fields = {};
                var sendVerificationEmail = false;
                var sendPasswordChangedEmail = false;

                if (req.files && req.files.resume) {
                    req.body.resume = req.files.resume[0].location;
                }

                if (req.files && req.files.avatar) {
                    req.body.avatar = req.files.avatar[0].location;
                }

                for (var i in req.body) {
                    if (i === 'email') {
                        if (!validator.isEmail(req.body.email)) {
                            continue;
                        } else {
                            sendVerificationEmail = true;
                            req.email = req.body.email;
                        }
                    }

                    if (i === 'password') {
                        if (
                            req.body.current_password &&
                            user.checkPassword(req.body.current_password)
                        ) {
                            sendPasswordChangedEmail = true;
                        } else {
                            continue;
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

                if (sendPasswordChangedEmail) {
                    //TODO do stuff
                }

                res.send({
                    status: true,
                    message: fields
                });
            })
            .catch(() => {
                res.send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    }
);

// Handles /v1/user/profile
router.get('/profile', function(req, res) {
    User.find()
        .byToken(req.authToken)
        .exec()
        .then(user => {
            res.send({
                status: true,
                user: {
                    email: user.email,
                    email_verified: user.email_verified,
                    application_submitted: user.application_submitted,
                    full_name: user.full_name,
                    birthday: user.birthday,
                    groups: user.getGroupsList(),
                    major: user.major,
                    university: user.university,
                    resume_uploaded: !!user.resume,
                    avatar: user.getAvatars()
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
