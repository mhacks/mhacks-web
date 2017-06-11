var router = require('express').Router(),
    Responses = require('../../responses/api'),
    validator = require('validator'),
    Application = require('../../db/model/Application.js');

router.post('/', function(req, res) {
    Application.find().byToken(req.authToken).then(query => {
        query
            .exec()
            .then(application => {
                var updateable_fields = ['hackathon_count', 'group_members'];
                var fields = {};

                for (var i in req.body) {
                    if (i === 'group_members') {
                        var addMembers = [];
                        if (Array.isArray(req.body.group_members)) {
                            req.body.group_members.forEach(function(email, elem) {
                                if (elem < 4 && validator.isEmail(email)) {
                                    addMembers.push(email.toLowerCase());
                                }
                            });
                        }

                        addMembers.forEach(function(email) {
                            application.addGroupMember(email);
                        });
                        continue;
                    }

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
