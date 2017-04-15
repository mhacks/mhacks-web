var router = require('express').Router(),
    Email = require('../../interactors/email.js'),
    Responses = require('../../responses/api/email.js');

// Disable all non-post methods for /v1/auth
router.use(function(req, res, next) {
    if (req.method !== 'POST') {
        res.status(405).send({
            status: false,
            message: Responses.METHOD_NOT_ALLOWED
        });
    }
    return next();
});

// Handles /v1/email/subscribe
router.post('/subscribe', function(req, res) {
    if (req.body.email) {
        Email.subscribe(req.body.email, function(err, result) {
            if (!err) {
                res.send({
                    status: true,
                    message: Responses.SUBSCRIBE_SUCCESSFUL
                });
            } else {
                var return_message = '';
                switch (err) {
                    case Email.ERRORS.ALREADY_SUBSCRIBED:
                        return_message = Responses.ALREADY_SUBSCRIBED;
                        break;
                    case Email.ERRORS.UNKNOWN:
                        return_message = Responses.UNKNOWN_ERROR;
                        break;
                }

                res.status(400).send({
                    status: false,
                    message: return_message
                });
            }
        });
    } else {
        res.status(400).send({
            status: false,
            message: Responses.EMAIL_NOT_PROVIDED
        });
    }
});

module.exports = router;