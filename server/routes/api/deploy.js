var router = require('express').Router(),
    Responses = require('../../responses/api/index.js'),
    config = require('../../../config/default.js'),
    deploy = require('../../interactors/deploy.js'),
    slack = require('../../interactors/slack.js'),
    crypto = require('../../interactors/crypto.js');

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
    var rawBody = JSON.stringify(req.body);
    if (
        req.headers['x-hub-signature'] &&
        req.headers['x-hub-signature'].replace(/sha1=/g, '') ===
            crypto.createHmac(config.deployment_secret, rawBody)
    ) {
        var event = req.headers['x-github-event'] || '';
        switch (event) {
            case 'push':
                if (req.body.ref === 'refs/heads/master') {
                    slack.sendMessage(config.slack_token, {
                        channel: config.slack_notifications_channel,
                        text: 'Deploying master to staging.'
                    });

                    deploy
                        .deployStaging()
                        .then(result => {
                            slack.sendMessage(config.slack_token, {
                                channel: config.slack_notifications_channel,
                                text: 'Success: ```' +
                                    deploy.formatResponse(result) +
                                    '```'
                            });
                        })
                        .catch(err => {
                            slack.sendMessage(config.slack_token, {
                                channel: config.slack_notifications_channel,
                                text: 'Error: ```' +
                                    deploy.formatResponse(err) +
                                    '```'
                            });
                        });
                }
                break;
        }

        res.send({
            status: true
        });
    } else {
        res.send({
            status: false
        });
    }
});

router.post('/webhook/slack', function(req, res) {
    if (req.body.token === config.deployment_secret) {
        if (config.deployment_users.indexOf(req.body.user_name) !== -1) {
            if (req.body.text === 'production') {
                res.send({
                    response_type: 'ephemeral',
                    text: 'Deploying master to production.'
                });

                deploy
                    .deployProduction()
                    .then(result => {
                        slack.sendMessage(req.body.response_url, {
                            response_type: 'ephemeral',
                            text: 'Success: ```' +
                                deploy.formatResponse(result) +
                                '```'
                        });
                    })
                    .catch(err => {
                        slack.sendMessage(req.body.response_url, {
                            response_type: 'ephemeral',
                            text: 'Error: ```' +
                                deploy.formatResponse(err) +
                                '```'
                        });
                    });
            } else {
                res.send({
                    response_type: 'ephemeral',
                    text: 'Deploying master to staging.'
                });

                deploy
                    .deployStaging()
                    .then(result => {
                        slack.sendMessage(req.body.response_url, {
                            response_type: 'ephemeral',
                            text: 'Success: ```' +
                                deploy.formatResponse(result) +
                                '```'
                        });
                    })
                    .catch(err => {
                        slack.sendMessage(req.body.response_url, {
                            response_type: 'ephemeral',
                            text: 'Error: ```' +
                                deploy.formatResponse(err) +
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
