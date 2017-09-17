var router = require('express').Router(),
    Responses = require('../../responses/api'),
    MentorApplication = require('../../db/model/MentorApplication.js'),
    authMiddleware = require('../../middleware/auth.js'),
    config = require('../../../config/default.js'),
    uploadHelper = require('../../interactors/multer-s3.js')(
        config.AWS_BUCKET_NAME
    );

router.post(
    '/application',
    authMiddleware('any', 'api'),
    uploadHelper.fields([{ name: 'resume' }]),
    function(req, res) {
        var updateable_fields = MentorApplication.getUpdateableFields(
            req.groups
        );
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

        MentorApplication.find()
            .byUser(req.user)
            .then(application => {
                if (application) {
                    application.updateFields(fields);

                    res.send({
                        status: true,
                        mentor_application: application
                    });
                } else {
                    fields.user = req.user;
                    MentorApplication.create(fields)
                        .then(application => {
                            res.send({
                                status: true,
                                mentor_application: application
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
    }
);

// Returns mentor application for the current user
router.get('/application', authMiddleware('any', 'api'), function(req, res) {
    MentorApplication.find({})
        .byUser(req.user)
        .then(application => {
            res.send({
                status: true,
                mentor_application: application || {}
            });
        })
        .catch(() => {
            res.send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

// Returns all mentor applications
router.get('/all', authMiddleware('reader admin', 'api'), function(req, res) {
    MentorApplication.find()
        .populate('user')
        .then(applications => {
            res.send({
                status: true,
                applications: applications.map(application => {
                    return Object.assign({}, application.toJSON(), {
                        email: application.user.email,
                        name: application.user.full_name,
                        university: application.user.university,
                        user: undefined
                    });
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
});

module.exports = router;
