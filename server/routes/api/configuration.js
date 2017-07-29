var router = require('express').Router(),
    ConfigurationSchema = require('../../db/model/Configuration.js'),
    authMiddleware = require('../../middleware/auth.js'),
    Responses = require('../../responses/api/announcement.js');

// Handles get requests for /v1/configuration
router.get('/', function(req, res) {
    ConfigurationSchema.findOne({}, '-_id -__v')
        .exec()
        .then(configuration => {
            if (configuration) {
                res.send({
                    status: true,
                    configuration: configuration
                });
            } else {
                res.send({
                    status: false,
                    configuration: {}
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });

    //TODO I don't know what this did so I didn't remove it yet
    /*
    if (req.get('Authorization')) {
        var authorization = req.get('Authorization');
        var token = authorization.replace(/Bearer /gi, '');

        User.find()
            .byToken(token)
            .exec()
            .then(user => {
                res.send({
                    status: true,
                    user: user.getProfile(),
                    configuration
                });
            })
            .catch(() => {
                configuration['should_logout'] = true;

                res.send({
                    status: false,
                    configuration
                });
            });
    }
    */
});

// Handles post requests for /v1/configuration/control
//This is on route /configuration/control so it is not easily accessible (it should be limited to one configuration at a time)
router.post('/contril', authMiddleware('admin', 'api'), function(req, res) {
    if (req.body.app_name && req.body.start_date && req.body.end_date) {
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
});

// Handles put requests for /v1/configuration/control
router.put('/control', authMiddleware('admin', 'api'), function(req, res) {
    ConfigurationSchema.findOne()
        .exec()
        .then(configuration => {
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
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

// Handles delete requests for /v1/configuration/control
router.delete('/control', authMiddleware('admin', 'api'), function(req, res) {
    if (req.body.app_name) {
        ConfigurationSchema.find()
            .byAppName(req.body.app_name)
            .exec()
            .then(configuration => {
                configuration.remove();
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
});

module.exports = router;
