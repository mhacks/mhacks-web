var router = require('express').Router(),
    authMiddleware = require('../../middleware/auth.js'),
    Responses = require('../../responses/api/index.js'),
    Device = require('../../db/model/Device.js');

router.post('/', function(req, res) {
    if (req.body.push_id) {
        if (
            req.body.push_categories &&
            !Array.isArray(req.body.push_categories)
        ) {
            req.body.push_categories = req.body.push_categories
                .split(',')
                .map(data => {
                    return data.replace(/\s+/g, '');
                });
        }

        authMiddleware('any', 'api', false, function() {
            Device.findOne({
                push_id: req.body.push_id
            })
                .exec()
                .then(device => {
                    if (device) {
                        var updateable_fields = Device.getUpdateableFields();
                        var fields = {};

                        for (var i in req.body) {
                            if (updateable_fields.indexOf(i) !== -1) {
                                fields[i] = req.body[i];
                            }
                        }

                        device.updateFields(fields);

                        res.send({
                            status: true,
                            device: Object.assign({}, device.toJSON(), {
                                user: undefined
                            })
                        });
                    } else {
                        Device.create({
                            push_id: req.body.push_id,
                            push_categories: req.body.push_categories
                        })
                            .then(device => {
                                res.send({
                                    status: true,
                                    device: Object.assign({}, device.toJSON(), {
                                        user: undefined
                                    })
                                });
                            })
                            .catch(err => {
                                res.send({
                                    status: false,
                                    message: err
                                });
                            });
                    }
                })
                .catch(err => {
                    res.send({
                        status: false,
                        message: err
                    });
                });
        })(req, res, function() {
            Device.findOne({
                push_id: req.body.push_id
            })
                .exec()
                .then(device => {
                    if (device) {
                        var updateable_fields = Device.getUpdateableFields();
                        var fields = {};

                        for (var i in req.body) {
                            if (updateable_fields.indexOf(i) !== -1) {
                                fields[i] = req.body[i];
                            }
                        }

                        device.user = req.user;
                        device.updateFields(fields);

                        device.user
                            .getProfile()
                            .then(profile => {
                                res.send({
                                    status: true,
                                    device: Object.assign({}, device.toJSON(), {
                                        user: profile
                                    })
                                });
                            })
                            .catch(err => {
                                res.status(500).send({
                                    status: false,
                                    message: err
                                });
                            });
                    } else {
                        Device.create({
                            user: req.user,
                            push_id: req.body.push_id,
                            push_categories: req.body.push_categories
                        })
                            .then(device => {
                                device.user
                                    .getProfile()
                                    .then(profile => {
                                        res.send({
                                            status: true,
                                            device: Object.assign(
                                                {},
                                                device.toJSON(),
                                                {
                                                    user: profile
                                                }
                                            )
                                        });
                                    })
                                    .catch(err => {
                                        res.status(500).send({
                                            status: false,
                                            message: err
                                        });
                                    });
                            })
                            .catch(err => {
                                res.send({
                                    status: false,
                                    message: err
                                });
                            });
                    }
                })
                .catch(err => {
                    res.send({
                        status: false,
                        message: err
                    });
                });
        });
    } else {
        res.status(400).send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
    }
});

module.exports = router;
