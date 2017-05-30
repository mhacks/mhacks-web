var router = require('express').Router(),
    Responses = require('../../responses/api/index.js'),
    config = require('../../../config/default.js'),
    deploy = require('../../interactors/deploy.js'),
    slack = require('../../interactors/slack.js');

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

router.post('/webhook/github', function(req, res) {
    var event = req.headers['x-github-event'] || '';
    switch (event) {
        case 'push':
            if (req.body.ref === 'refs/heads/master') {
                deploy.deployStaging();
            }
            break;
    }

    res.send({
        status: true
    });
});

router.post('/webhook/slack', function(req, res) {
    if (req.body.token === config.deployment_secret) {
        if (config.deployment_users.indexOf(req.body.user_name) !== -1) {
            if (req.body.text === 'production') {
                res.send({
                    response_type: 'ephemeral',
                    text: Responses.Deploy.EXECUTING + 'Production'
                });

                deploy
                    .deployProduction()
                    .then(result => {
                        slack.sendMessage(req.body.response_url, {
                            response_type: 'ephemeral',
                            text: 'Result: ```' +
                                JSON.stringify(result, null, 4) +
                                '```'
                        });
                    })
                    .catch(err => {
                        slack.sendMessage(req.body.response_url, {
                            response_type: 'ephemeral',
                            text: 'Error: ```' +
                                JSON.stringify(err, null, 4) +
                                '```'
                        });
                    });
            } else {
                res.send({
                    response_type: 'ephemeral',
                    text: Responses.Deploy.EXECUTING + 'Staging'
                });

                deploy
                    .deployStaging()
                    .then(result => {
                        slack.sendMessage(req.body.response_url, {
                            response_type: 'ephemeral',
                            text: 'First: ```' +
                                JSON.stringify(result, null, 4) +
                                '```'
                        });
                    })
                    .catch(err => {
                        slack.sendMessage(req.body.response_url, {
                            response_type: 'ephemeral',
                            text: 'Error: ```' +
                                JSON.stringify(err, null, 4) +
                                '```'
                        });
                    });
            }
        } else {
            res.send({
                response_type: 'ephemeral',
                text: Responses.Auth.UNAUTHORIZED
            });
        }
    } else {
        res.send({
            response_type: 'ephemeral',
            text: Responses.Auth.UNAUTHORIZED
        });
    }
});

module.exports = router;
