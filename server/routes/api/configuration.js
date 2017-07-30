var router = require('express').Router(),
    User = require('../../db/model/User.js');

// Handles get requests for /v1/configuration
router.get('/', function(req, res) {
    const configuration = {
        is_livepage_enabled: false,
        is_applications_open: true
    };

    if (req.get('Authorization')) {
        var authorization = req.get('Authorization');
        var token = authorization.replace(/Bearer /gi, '');

        User.find()
            .byToken(token)
            .exec()
            .then(user => {
                user.getProfile().then(profile => {
                    res.send({
                        status: true,
                        user: user.profile,
                        configuration
                    });
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
        res.send({
            status: false,
            configuration
        });
    }
});

module.exports = router;
