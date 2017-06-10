var router = require('express').Router(),
    validator = require('validator'),
    Responses = require('../../responses/api'),
    User = require('../../db/model/User.js'),
    Application = require('../../db/model/Application.js');

router.post('/', function (req, res) {
    Application.find()
        .byToken(req.authToken).then(query => {
        query.exec().then(application => {
            var updateable_fields = ['hackathon_count', 'group_members'];
            var fields = {};

            for (var i in req.body) {
                if (updateable_fields.indexOf(i) !== -1) {
                    fields[i] = req.body[i];
                }
            }

            application.updateFields(fields);

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
});

// Handles /v1/user/profile
router.get('/', function (req, res) {
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
