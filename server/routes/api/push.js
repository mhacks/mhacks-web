var router = require('express').Router(),
    PushNotification = require('../../db/model/PushNotification'),
    authMiddleware = require('../../middleware/auth.js'),
    Responses = require('../../responses/api/announcement.js'),
    push = require('../../interactors/push.js'),
    Device = require('../../db/model/Device.js'),
    config = require('../../../config/default.js'),
    util = require('util');

function sortByDate(a, b) {
    return new Date(b.broadcastTime) - new Date(a.broadcastTime);
}

// Handles get requests for /v1/push
router.get('/', function(req, res) {
    authMiddleware('admin', 'api', true, function() {
        PushNotification.find()
            .byIsPublic(req.query.since)
            .exec()
            .then(pushnotifications => {
                pushnotifications.sort(sortByDate);

                res.send({
                    status: true,
                    pushnotifications: pushnotifications
                });
            })
            .catch(err => {
                console.error(err);
                res.send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    })(req, res, function() {
        PushNotification.find()
            .since(req.query.since)
            .exec()
            .then(pushnotifications => {
                pushnotifications.sort(sortByDate);
                res.send({
                    status: true,
                    pushnotifications: pushnotifications
                });
            })
            .catch(err => {
                console.error(err);
                res.send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    });
});

router.post('/', authMiddleware('admin', 'api'), function(req, res) {
    if (req.session.loggedIn) {
        if (req.body.title && req.body.body && req.body.category) {
            PushNotification.create({
                title: req.body.title,
                body: req.body.body,
                broadcastTime: req.body.broadcastTime,
                category: req.body.category,
                isApproved: req.body.isApproved,
                isSent: req.body.isSent
            })
                .then(pushnotification => {
                    res.send({
                        status: true,
                        pushnotification: pushnotification
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
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PERMISSIONS_REQUIRED
        });
    }
});

router.put('/', authMiddleware('admin', 'api'), function(req, res) {
    if (req.session.loggedIn) {
        if (req.body.id) {
            PushNotification.findById(req.body.id)
                .exec()
                .then(pushnotification => {
                    pushnotification.title =
                        req.body.title || pushnotification.title;
                    pushnotification.body =
                        req.body.body || pushnotification.body;
                    pushnotification.broadcastTime =
                        req.body.broadcastTime ||
                        pushnotification.broadcastTime;
                    pushnotification.category =
                        req.body.category || pushnotification.category;
                    pushnotification.isApproved =
                        req.body.isApproved || pushnotification.isApproved;
                    pushnotification.isSent =
                        req.body.isSent || pushnotification.isSent;
                    pushnotification.save();
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
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PERMISSIONS_REQUIRED
        });
    }
});

router.patch('/', authMiddleware('admin', 'api'), function(req, res) {
    if (req.session.loggedIn) {
        if (req.body.id) {
            PushNotification.updateOne({ _id: req.body.id }, req.body, {
                runValidators: true
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
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PERMISSIONS_REQUIRED
        });
    }
});

// prettier-ignore
if (config.service !== 'shortener') {
    var notificationInterval = setInterval(function() { // eslint-disable-line
        PushNotification.find()
            .byIsReadyToSend()
            .exec()
            .then(pushnotifications => {
                if (pushnotifications) {
                    pushnotifications.forEach(function(pushnotification) {
                        getDevicesForPush(pushnotification).then(device_ids => {
                            if (config.push_notifications.enabled) {
                                var res = push.sendNotification(
                                    device_ids,
                                    pushnotification.title,
                                    pushnotification.body
                                );

                                res.then(function() {
                                    Array.prototype.slice.call(arguments).forEach((data) => {
                                        console.log(util.inspect(data, false, null));
                                    });
                                }).catch(function() {
                                    Array.prototype.slice.call(arguments).forEach((data) => {
                                        console.log(util.inspect(data, false, null));
                                    });
                                });

                                console.log('Sending push notifications:', device_ids, res);
                            } else {
                                console.log('Push notification no-op:', device_ids, pushnotification.title, pushnotification.body);
                            }

                            pushnotification.isSent = true;
                            pushnotification.save();
                        }).catch(err => {
                            console.error('Caught error when sending push notifications:', err);
                        });
                    });
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, 1000);
}

function getDevicesForPush(pushnotification) {
    return new Promise((resolve, reject) => {
        var device_ids = [],
            query = {};
        if (pushnotification.devices.length < 1) {
            query = {
                push_id: { $exists: true },
                push_categories: pushnotification.category
            };

            if (pushnotification.category === 'emergency') {
                delete query.push_categories;
            }

            Device.find(query)
                .exec()
                .then(devices => {
                    devices.forEach(function(device) {
                        device_ids.push(device.push_id);
                    });
                    resolve(device_ids);
                })
                .catch(err => {
                    reject(err);
                });
        } else {
            query = {
                _id: { $in: pushnotification.devices },
                push_id: { $exists: true },
                push_categories: pushnotification.category
            };

            if (pushnotification.category === 'emergency') {
                delete query.push_categories;
            }

            Device.find(query)
                .exec()
                .then(devices => {
                    devices.forEach(function(device) {
                        device_ids.push(device.push_id);
                        resolve(device_ids);
                    });
                })
                .catch(err => {
                    reject(err);
                });
        }
    });
}

module.exports = router;
