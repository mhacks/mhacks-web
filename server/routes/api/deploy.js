var router = require('express').Router(),
    Responses = require('../../responses/api/index.js'),
    config = require('../../../config/default.js'),
    deploy = require('../../interactors/deploy.js'),
    slack = require('../../interactors/slack.js'),
    crypto = require('../../interactors/crypto.js'),
    request = require('request-promise-native');

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
                            slack.postSnippet(config.slack_token, {
                                channels: config.slack_notifications_channel,
                                content: deploy.formatResponse(result),
                                title:
                                    new Date().toString() +
                                    ' Staging Deploy Success'
                            });
                        })
                        .catch(err => {
                            slack.postSnippet(config.slack_token, {
                                channels: config.slack_notifications_channel,
                                content: deploy.formatResponse(err),
                                title:
                                    new Date().toString() +
                                    ' Staging Deploy Error'
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
            if (req.body.text) {
                req.body.text = req.body.text.toLowerCase();
            }

            if (req.body.text === 'production') {
                if (req.hostname === 'mhacks.org') {
                    request.post({
                        method: 'POST',
                        uri: 'https://staging.mhacks.org' + req.originalUrl,
                        body: req.body,
                        json: true
                    });

                    res.send({
                        response_type: 'in_channel',
                        text:
                            'Deploying master to production. Crossing over to staging to complete update. Finesse it.'
                    });
                } else {
                    deploy
                        .deployProduction()
                        .then(result => {
                            slack.postSnippet(config.slack_token, {
                                channels: req.body.channel_id,
                                content: deploy.formatResponse(result),
                                title:
                                    new Date().toString() +
                                    ' Production Deploy Success'
                            });
                        })
                        .catch(err => {
                            slack.postSnippet(config.slack_token, {
                                channels: req.body.channel_id,
                                content: deploy.formatResponse(err),
                                title:
                                    new Date().toString() +
                                    ' Production Deploy Error'
                            });
                        });
                }
            } else if (req.body.text.indexOf('damage report') !== -1) {
                if (req.body.text.indexOf('production') !== -1) {
                    res.send({
                        response_type: 'in_channel',
                        text: 'Retrieving damage report from production'
                    });

                    deploy
                        .productionDamageReport()
                        .then(result => {
                            slack.postSnippet(config.slack_token, {
                                channels: req.body.channel_id,
                                content: deploy.formatResponse(result),
                                title:
                                    new Date().toString() +
                                    ' Production Damage Report'
                            });
                        })
                        .catch(err => {
                            slack.postSnippet(config.slack_token, {
                                channels: req.body.channel_id,
                                content: deploy.formatResponse(err),
                                title:
                                    new Date().toString() +
                                    ' Production Damage Report Error'
                            });
                        });
                } else {
                    res.send({
                        response_type: 'in_channel',
                        text: 'Retrieving damage report from staging'
                    });

                    deploy
                        .stagingDamageReport()
                        .then(result => {
                            slack.postSnippet(config.slack_token, {
                                channels: req.body.channel_id,
                                content: deploy.formatResponse(result),
                                title:
                                    new Date().toString() +
                                    ' Staging Damage Report'
                            });
                        })
                        .catch(err => {
                            slack.postSnippet(config.slack_token, {
                                channels: req.body.channel_id,
                                content: deploy.formatResponse(err),
                                title:
                                    new Date().toString() +
                                    ' Staging Damage Report Error'
                            });
                        });
                }
            } else {
                res.send({
                    response_type: 'in_channel',
                    text: 'Deploying master to staging. Finesse it.'
                });

                deploy
                    .deployStaging()
                    .then(result => {
                        slack.postSnippet(config.slack_token, {
                            channels: req.body.channel_id,
                            content: deploy.formatResponse(result),
                            title:
                                new Date().toString() +
                                ' Staging Deploy Success'
                        });
                    })
                    .catch(err => {
                        slack.postSnippet(config.slack_token, {
                            channels: req.body.channel_id,
                            content: deploy.formatResponse(err),
                            title:
                                new Date().toString() + ' Staging Deploy Error'
                        });
                    });
            }
        } else {
            res.send({
                response_type: 'in_channel',
                text: Responses.Auth.UNAUTHORIZED
            });
        }
    } else {
        res.send({
            response_type: 'in_channel',
            text: Responses.Auth.UNAUTHORIZED
        });
    }
});

module.exports = router;
