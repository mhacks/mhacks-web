var router = require('express').Router(),
    validator = require('validator'),
    artifact = require('../../interactors/artifact.js'),
    Responses = require('../../responses/api/index.js'),
    authMiddleware = require('../../middleware/auth.js'),
    mime = require('mime');

router.get('/resume/:email', authMiddleware('admin', 'api'), function(
    req,
    res
) {
    if (req.params.email && validator.isEmail(req.params.email)) {
        artifact(req.params.email, 'resume', req.query.application)
            .then(stream => {
                res.attachment(stream[0]);
                res.send(stream[1].data.Body);
            })
            .catch(err => {
                res.status(500).send({
                    status: false,
                    message: err.message
                });
            });
    } else {
        res.status(404).send({
            status: false,
            message: Responses.NOT_FOUND
        });
    }
});

router.get('/avatar/:email', function(req, res) {
    if (req.params.email && validator.isEmail(req.params.email)) {
        artifact(req.params.email, 'avatar')
            .then(stream => {
                res.setHeader('Content-Type', mime.lookup(stream[0]));
                res.send(stream[1].data.Body);
            })
            .catch(err => {
                res.status(500).send({
                    status: false,
                    message: err.message
                });
            });
    } else {
        res.status(404).send({
            status: false,
            message: Responses.NOT_FOUND
        });
    }
});

module.exports = router;
