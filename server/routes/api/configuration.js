var router = require('express').Router(),
    ConfigurationSchema = require('../../db/model/Configuration.js'),
    authMiddleware = require('../../middleware/auth.js'),
    Responses = require('../../responses/api/announcement.js'),
    config = require('../../../config/default.js'),
    User = require('../../db/model/User.js');

// Handles get requests for /v1/configuration
router.get('/', authMiddleware('any', 'api', false, undefined, false), function(
    req,
    res
) {
    ConfigurationSchema.findOne({}, '-_id -__v')
        .exec()
        .then(configuration => {
            if (configuration) {
                configuration = JSON.parse(JSON.stringify(configuration));

                if (req.authToken) {
                    User.find()
                        .byToken(req.authToken)
                        .then(user => {
                            user.getProfile().then(profile => {
                                res.send({
                                    status: true,
                                    user: profile,
                                    configuration: configuration
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
                } else {
                    configuration.should_logout = true;

                    res.send({
                        status: true,
                        configuration: configuration
                    });
                }
            } else {
                ConfigurationSchema.create({
                    app_name: config.app_name,
                    start_date: config.start_date,
                    end_date: config.end_date,
                    is_live_page_enabled: config.is_live_page_enabled,
                    is_application_open: config.is_application_open
                })
                    .then(configuration => {
                        configuration = JSON.parse(
                            JSON.stringify(configuration)
                        );

                        if (req.authToken) {
                            User.find()
                                .byToken(req.authToken)
                                .then(user => {
                                    user.getProfile().then(profile => {
                                        res.send({
                                            status: true,
                                            user: profile,
                                            configuration: configuration
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
                        } else {
                            configuration.should_logout = true;

                            res.send({
                                status: true,
                                configuration: configuration
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
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

// Handles post requests for /v1/configuration/control
//This is on route /configuration/control so it is not easily accessible (it should be limited to one configuration at a time)
router.post('/control', authMiddleware('admin', 'api'), function(req, res) {
    ConfigurationSchema.findOne()
        .exec()
        .then(configuration => {
            if (configuration) {
                configuration.app_name =
                    req.body.app_name || configuration.app_name;
                configuration.start_date =
                    req.body.start_date || configuration.start_date;
                configuration.end_date =
                    req.body.end_date || configuration.end_date;
                configuration.is_live_page_enabled =
                    req.body.is_live_page_enabled ||
                    configuration.is_live_page_enabled;
                configuration.is_application_open =
                    req.body.is_application_open ||
                    configuration.is_application_open;

                configuration.save();
                res.send({
                    status: true
                });
            } else {
                if (
                    req.body.app_name &&
                    req.body.start_date &&
                    req.body.end_date
                ) {
                    ConfigurationSchema.create({
                        app_name: req.body.app_name,
                        start_date: req.body.start_date,
                        end_date: req.body.end_date,
                        is_live_page_enabled: req.body.is_live_page_enabled,
                        is_application_open: req.body.is_application_open
                    })
                        .then(() => {
                            res.send({
                                status: true
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).send({
                                status: false,
                                message: Responses.UNKNOWN_ERROR
                            });
                        });
                } else {
                    res.status(401).send({
                        status: false,
                        message: Responses.PARAMS_NOT_FOUND
                    });
                }
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
