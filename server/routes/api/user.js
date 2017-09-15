var router = require('express').Router(),
    validator = require('validator'),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    User = require('../../db/model/User.js'),
    config = require('../../../config/default.js'),
    uploadHelper = require('../../interactors/multer-s3.js')(
        config.AWS_BUCKET_NAME
    ),
    qrcode = require('../../interactors/qr.js'),
    Application = require('../../db/model/Application.js'),
    Confirmation = require('../../db/model/Confirmation.js'),
    ScanEvent = require('../../db/model/ScanEvent.js'),
    Scan = require('../../db/model/Scan.js'),
    passbook = require('../../interactors/passbook.js');

router.post(
    '/profile',
    authMiddleware('any', 'api'),
    uploadHelper.fields([{ name: 'avatar' }, { name: 'resume' }]),
    function(req, res) {
        if (req.user) {
            var updateable_fields = User.getUpdateableFields(req.groups);
            var fields = {};
            var sendVerificationEmail = false;
            var sendPasswordChangedEmail = false;

            if (req.files && req.files.resume) {
                req.body.resume =
                    req.files.resume[0].location ||
                    '/uploads/' + req.files.resume[0].filename;
            }

            if (req.files && req.files.avatar) {
                req.body.avatar =
                    req.files.avatar[0].location ||
                    '/uploads/' + req.files.avatar[0].filename;
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
                        req.user.checkPassword(req.body.current_password)
                    ) {
                        sendPasswordChangedEmail = true;
                    } else {
                        continue;
                    }
                }

                if (i === 'birthday') {
                    if (!parseInt(req.body[i])) {
                        continue;
                    }
                }

                if (updateable_fields.indexOf(i) !== -1) {
                    fields[i] = req.body[i];
                }
            }

            req.user.updateFields(fields);

            if (sendVerificationEmail) {
                req.user.sendVerificationEmail();
            }

            if (sendPasswordChangedEmail) {
                //TODO do stuff
            }

            res.send({
                status: true,
                message: fields
            });
        } else {
            res.status(401).send({
                status: false,
                message: Responses.Auth.UNAUTHORIZED
            });
        }
    }
);

// Handles /v1/user/profile
router.get('/profile', function(req, res) {
    if (req.user) {
        req.user.getProfile().then(profile => {
            res.send({
                status: true,
                user: profile
            });
        });
    } else {
        res.status(401).send({
            status: false,
            message: Responses.Auth.UNAUTHORIZED
        });
    }
});

router.get('/ticket', authMiddleware('any', 'api'), function(req, res) {
    if (req.user && req.user.application_submitted) {
        Application.find()
            .byEmail(req.user.email)
            .exec()
            .then(application => {
                if (application) {
                    if (application.status === 'accepted') {
                        Confirmation.findOne({ user: req.user })
                            .exec()
                            .then(confirmation => {
                                if (confirmation) {
                                    res.set('Content-Type', 'image/png');
                                    qrcode.writeQRCodeToStream(
                                        req.user.email,
                                        res
                                    );
                                } else {
                                    res.status(400).send({
                                        status: false,
                                        message:
                                            Responses.Application.NOT_CONFIRMED
                                    });
                                }
                            });
                    } else {
                        res.status(400).send({
                            status: false,
                            message: Responses.Application.NOT_ACCEPTED
                        });
                    }
                } else {
                    res.status(400).send({
                        status: false,
                        message: Responses.Application.NOT_SUBMITTED
                    });
                }
            });
    } else {
        res.status(401).send({
            status: false,
            message: Responses.Auth.UNAUTHORIZED
        });
    }
});

router.get('/ticket/passbook', authMiddleware('any', 'api'), function(
    req,
    res
) {
    if (req.user && req.user.application_submitted) {
        Application.find()
            .byEmail(req.user.email)
            .exec()
            .then(application => {
                if (application) {
                    if (application.status === 'accepted') {
                        Confirmation.findOne({ user: req.user })
                            .exec()
                            .then(confirmation => {
                                if (confirmation) {
                                    passbook
                                        .createPass(req.user.email)
                                        .then(pass => {
                                            if (pass) {
                                                res.attachment('MHacks.pkpass');
                                                pass.render(res).catch(err => {
                                                    console.error(err);

                                                    res.status(500).send({
                                                        status: false,
                                                        message: err
                                                    });
                                                });
                                            } else {
                                                res.status(404).send({
                                                    status: false,
                                                    message: Responses.NOT_FOUND
                                                });
                                            }
                                        })
                                        .catch(err => {
                                            res.status(500).send({
                                                status: false,
                                                message: err
                                            });
                                        });
                                } else {
                                    res.status(400).send({
                                        status: false,
                                        message:
                                            Responses.Application.NOT_CONFIRMED
                                    });
                                }
                            });
                    } else {
                        res.status(400).send({
                            status: false,
                            message: Responses.Application.NOT_ACCEPTED
                        });
                    }
                } else {
                    res.status(400).send({
                        status: false,
                        message: Responses.Application.NOT_SUBMITTED
                    });
                }
            });
    } else {
        res.status(401).send({
            status: false,
            message: Responses.Auth.UNAUTHORIZED
        });
    }
});

function isMinor(birthdate) {
    const now = new Date();
    const birth = new Date(birthdate);

    var age = now.getFullYear() - birth.getFullYear();
    const ageMonth = now.getMonth() - birth.getMonth();
    const ageDay = now.getDate() - birth.getDate();

    if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
        age = parseInt(age) - 1;
    }

    return age < 18;
}

router.post('/ticket/verify', authMiddleware('scanner admin', 'api'), function(
    req,
    res
) {
    Scan.find()
        .byType('registration')
        .exec()
        .then(scan => {
            if (scan) {
                if (req.body.email) {
                    User.find()
                        .byEmail(req.body.email)
                        .exec()
                        .then(user => {
                            if (user) {
                                ScanEvent.findOne({
                                    user: user,
                                    event: scan
                                })
                                    .exec()
                                    .then(event => {
                                        if (event) {
                                            res.send({
                                                status: true,
                                                feedback: [
                                                    {
                                                        label: 'Name',
                                                        value: user.full_name
                                                    },
                                                    {
                                                        label: 'Minor',
                                                        value: isMinor(
                                                            user.birthday
                                                        )
                                                            ? 'Yes'
                                                            : 'No'
                                                    },
                                                    {
                                                        label:
                                                            'Already Scanned',
                                                        value: 'Yes'
                                                    }
                                                ]
                                            });
                                        } else {
                                            Application.find()
                                                .byEmail(req.body.email)
                                                .exec()
                                                .then(application => {
                                                    if (application) {
                                                        if (
                                                            application.status ===
                                                            'accepted'
                                                        ) {
                                                            Confirmation.findOne(
                                                                {
                                                                    user
                                                                }
                                                            )
                                                                .exec()
                                                                .then(
                                                                    confirmation => {
                                                                        if (
                                                                            confirmation
                                                                        ) {
                                                                            ScanEvent.create(
                                                                                {
                                                                                    user,
                                                                                    scanner:
                                                                                        req.user,
                                                                                    event: scan
                                                                                }
                                                                            ).then(
                                                                                scanevent => {
                                                                                    user
                                                                                        .getProfile()
                                                                                        .then(
                                                                                            profile => {
                                                                                                res.send(
                                                                                                    {
                                                                                                        status: true,
                                                                                                        scanevent: Object.assign(
                                                                                                            {},
                                                                                                            scanevent,
                                                                                                            {
                                                                                                                user: profile
                                                                                                            }
                                                                                                        ),
                                                                                                        feedback: [
                                                                                                            {
                                                                                                                label:
                                                                                                                    'Name',
                                                                                                                value:
                                                                                                                    user.full_name
                                                                                                            },
                                                                                                            {
                                                                                                                label:
                                                                                                                    'Minor',
                                                                                                                value: isMinor(
                                                                                                                    user.birthday
                                                                                                                )
                                                                                                                    ? 'Yes'
                                                                                                                    : 'No'
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        );
                                                                                }
                                                                            );
                                                                        } else {
                                                                            res
                                                                                .status(
                                                                                    400
                                                                                )
                                                                                .send(
                                                                                    {
                                                                                        status: false,
                                                                                        message:
                                                                                            Responses
                                                                                                .Application
                                                                                                .NOT_CONFIRMED
                                                                                    }
                                                                                );
                                                                        }
                                                                    }
                                                                );
                                                        } else {
                                                            res
                                                                .status(400)
                                                                .send({
                                                                    status: false,
                                                                    message:
                                                                        Responses
                                                                            .Application
                                                                            .NOT_ACCEPTED
                                                                });
                                                        }
                                                    } else {
                                                        res.status(400).send({
                                                            status: false,
                                                            message:
                                                                Responses
                                                                    .Application
                                                                    .NOT_SUBMITTED
                                                        });
                                                    }
                                                });
                                        }
                                    });
                            } else {
                                res.status(400).send({
                                    status: false,
                                    message: Responses.Auth.USER_NOT_FOUND
                                });
                            }
                        });
                } else {
                    res.status(400).send({
                        status: false,
                        message: Responses.MISSING_PARAMETERS
                    });
                }
            } else {
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

module.exports = router;
