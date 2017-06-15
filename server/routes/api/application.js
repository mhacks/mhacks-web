var router = require('express').Router(),
    Responses = require('../../responses/api'),
    User = require('../../db/model/User.js'),
    Application = require('../../db/model/Application.js'),
    config = require('../../../config/default.js'),
    uploadHelper = require('../../interactors/multer-s3.js')(
        config.AWS_BUCKET_NAME
    );

router.post('/', uploadHelper.fields([{ name: 'resume' }]), function(req, res) {
    User.find()
        .byToken(req.authToken)
        .exec()
        .then(user => {
            const {
                birthday,
                university,
                major,
                tshirt_size,
                experience
            } = req.body;

            if (
                !(birthday &&
                    university &&
                    major &&
                    tshirt_size &&
                    experience &&
                    (user.resume || (req.files && req.files.resume)))
            ) {
                res.status(400).send({
                    status: false,
                    message: Responses.MISSING_PARAMETERS
                });
            } else if (user.application_submitted) {
                res.status(400).send({
                    status: false,
                    message: Responses.Application.ALREADY_SUBMITTED
                });
            } else {
                Application.create({
                    user: user.email,
                    birthday,
                    university,
                    major,
                    tshirt_size,
                    experience,
                    resume: user.resume || req.files.resume[0].location
                })
                    .then(application => {
                        user.application_submitted = true;
                        user.save();

                        res.send({
                            status: true,
                            app: application
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
        .catch(() => {
            res.send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

router.get('/', function(req, res) {
    Application.find()
        .byToken(req.authToken)
        .exec()
        .then(application => {
            res.send({
                status: true,
                application: application
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
