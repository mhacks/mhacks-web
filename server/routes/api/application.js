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
            var updateable_fields = [
                'birthday',
                'university',
                'major',
                'tshirt_size',
                'experience',
                'resume',
                'github',
                'linkedin',
                'devpost',
                'portfolio',
                'race',
                'sex',
                'why_mhacks',
                'favorite_memory',
                'anything_else',
                'needs_reimbursement',
                'departing_from',
                'requested_reimbursement'
            ];
            var fields = {};

            if (req.files && req.files.resume) {
                req.body.resume = req.files.resume[0].location;
            }

            for (var i in req.body) {
                if (updateable_fields.indexOf(i) !== -1) {
                    fields[i] = req.body[i];
                }
            }

            Application.find().byToken(req.authToken).then(application => {
                if (application) {
                    application.updateFields(fields);
                } else {
                    fields.email = user.email;
                    Application.create(fields)
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
