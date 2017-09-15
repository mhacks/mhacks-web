var router = require('express').Router(),
    Responses = require('../../responses/api'),
    User = require('../../db/model/User.js'),
    Application = require('../../db/model/Application.js'),
    Confirmation = require('../../db/model/Confirmation.js'),
    config = require('../../../config/default.js'),
    authMiddleware = require('../../middleware/auth.js'),
    uploadHelper = require('../../interactors/multer-s3.js')(
        config.AWS_BUCKET_NAME
    );

router.post('/', uploadHelper.fields([{ name: 'resume' }]), function(req, res) {
    User.find()
        .byToken(req.authToken)
        .exec()
        .then(user => {
            var updateable_fields = Application.getUpdateableFields(req.groups);
            var fields = {};

            if (req.files && req.files.resume) {
                req.body.resume =
                    req.files.resume[0].location ||
                    '/uploads/' + req.files.resume[0].filename;
            }

            for (var i in req.body) {
                if (i === 'birthday') {
                    if (!parseInt(req.body[i])) {
                        continue;
                    }
                }

                if (updateable_fields.indexOf(i) !== -1) {
                    fields[i] = req.body[i];
                }
            }

            Application.find()
                .byToken(req.authToken)
                .then(application => {
                    if (application) {
                        application.updateFields(fields);

                        res.send({
                            status: true,
                            application: application
                        });
                    } else {
                        fields.user = user.email;
                        Application.create(fields)
                            .then(application => {
                                user.application_submitted = true;
                                user.save();

                                res.send({
                                    status: true,
                                    application: application
                                });
                            })
                            .catch(err => {
                                console.error(err);
                                res.status(500).send({
                                    status: false,
                                    message: Responses.UNKNOWN_ERROR
                                });
                            });
                    }
                });
        })
        .catch(err => {
            console.error(err);
            res.send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

// Returns application for the current user
router.get('/', function(req, res) {
    Application.find({}, '-score -reader -review_notes')
        .byToken(req.authToken)
        .then(application => {
            res.send({
                status: true,
                application: application || {}
            });
        })
        .catch(() => {
            res.send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

// Returns all applications
router.get('/all', authMiddleware('reader admin', 'api'), function(req, res) {
    Application.find()
        .then(applications => {
            User.find({
                email: {
                    $in: applications
                        .filter(application => application.user)
                        .map(application => application.user)
                }
            })
                .then(users => {
                    Confirmation.find()
                        .then(confirmations => {
                            res.send({
                                status: true,
                                applications: applications.map(application => {
                                    const associated_user = users.find(
                                        user => user.email === application.user
                                    );

                                    if (!associated_user) {
                                        return application;
                                    }

                                    const user_doc = {
                                        full_name: associated_user.full_name,
                                        email: associated_user.email
                                    };

                                    if (application.resume) {
                                        user_doc.resume = application.getResume();
                                    }

                                    const associated_confirmation = confirmations.find(
                                        confirmation =>
                                            confirmation.user.equals(
                                                associated_user._id
                                            )
                                    );

                                    if (!associated_confirmation) {
                                        return Object.assign(
                                            {},
                                            application.toJSON(),
                                            user_doc
                                        );
                                    }

                                    return Object.assign(
                                        {},
                                        application.toJSON(),
                                        user_doc,
                                        Object.assign(
                                            {},
                                            associated_confirmation.toJSON(),
                                            { user: undefined }
                                        )
                                    );
                                })
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).send({
                                status: false,
                                message: Responses.UNKNOWN_ERROR
                            });
                        });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send({
                        status: false,
                        message: Responses.UNKNOWN_ERROR
                    });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

// Returns all applications
router.get(
    '/all/sponsor',
    authMiddleware('sponsor reader admin', 'api'),
    function(req, res) {
        Application.find({
            status: 'accepted'
        })
            .select(
                '-needs_reimbursement -requested_reimbursement -status -score -reader -reimbursement'
            )
            .then(applications => {
                User.find({
                    email: {
                        $in: applications
                            .filter(application => application.user)
                            .map(application => application.user)
                    }
                })
                    .select('_id full_name email')
                    .then(users => {
                        Confirmation.find()
                            .then(confirmations => {
                                res.send({
                                    status: true,
                                    applications: applications.map(
                                        application => {
                                            const associated_user = users.find(
                                                user =>
                                                    user.email ===
                                                    application.user
                                            );

                                            if (!associated_user) {
                                                return application;
                                            }

                                            const user_doc = {
                                                full_name:
                                                    associated_user.full_name,
                                                email: associated_user.email
                                            };

                                            if (application.resume) {
                                                user_doc.resume = application.getResume();
                                            }

                                            const associated_confirmation = confirmations.find(
                                                confirmation =>
                                                    confirmation.user.equals(
                                                        associated_user._id
                                                    )
                                            );

                                            if (!associated_confirmation) {
                                                return Object.assign(
                                                    {},
                                                    application.toJSON(),
                                                    user_doc
                                                );
                                            }

                                            return Object.assign(
                                                {},
                                                application.toJSON(),
                                                user_doc,
                                                Object.assign(
                                                    {},
                                                    associated_confirmation.toJSON(),
                                                    { user: undefined }
                                                )
                                            );
                                        }
                                    )
                                });
                            })
                            .catch(err => {
                                console.error(err);
                                res.status(500).send({
                                    status: false,
                                    message: Responses.UNKNOWN_ERROR
                                });
                            });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send({
                            status: false,
                            message: Responses.UNKNOWN_ERROR
                        });
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    }
);

router.post('/confirm', function(req, res) {
    User.find()
        .byToken(req.authToken)
        .exec()
        .then(user => {
            var updateable_fields = Confirmation.getUpdateableFields();
            var fields = {};

            for (var i in req.body) {
                if (updateable_fields.indexOf(i) !== -1) {
                    fields[i] = req.body[i];
                }
            }

            Confirmation.find()
                .byToken(req.authToken)
                .then(confirmation => {
                    if (confirmation) {
                        confirmation.updateFields(fields);

                        res.send({
                            status: true,
                            confirmation
                        });
                    } else {
                        fields.user = user;
                        Confirmation.create(fields)
                            .then(confirmation => {
                                // strip extra info out of response
                                res.send({
                                    status: true,
                                    confirmation: Object.assign(
                                        {},
                                        confirmation.toJSON(),
                                        {
                                            user: undefined
                                        }
                                    )
                                });
                            })
                            .catch(err => {
                                console.error(err);
                                res.status(500).send({
                                    status: false,
                                    message: Responses.UNKNOWN_ERROR
                                });
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
        })
        .catch(err => {
            console.error(err);
            res.send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

router.get('/confirm', function(req, res) {
    Confirmation.find()
        .byToken(req.authToken)
        .then(confirmation => {
            res.send({
                status: true,
                confirmation: confirmation || {}
            });
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
