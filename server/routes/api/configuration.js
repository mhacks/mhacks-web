var router = require('express').Router(),
    ConfigurationSchema = require('../../db/model/Configuration.js'),
    authMiddleware = require('../../middleware/auth.js'),
    User = require('../../db/model/User.js'),
    Responses = require('../../responses/api/announcement.js');

// Handles get requests for /v1/configuration
router.get('/', function(req, res) {
    if (req.get('Authorization')) {
        var authorization = req.get('Authorization');
        var token = authorization.replace(/Bearer /gi, '');
        var configuration = {}

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
    } else {
        ConfigurationSchema.findOne()
            .exec()
            .then(config => {
                res.send({
                    status: true,
                    config
                });
            })
            .catch(err => {
                console.error(err);
                res.send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    }
})

//This is on create route so it's not easily accesable (should be limited to one config at a time)
//authMiddleware('admin', 'api'),
router.post('/create', /*authMiddleware('admin', 'api'), */ function(req, res) {
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

//Add patch too

module.exports = router;
