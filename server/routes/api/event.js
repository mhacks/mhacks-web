var router = require('express').Router(),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    Location = require('../../db/model/Location.js'),
    Event = require('../../db/model/Event.js');

router.post('/', authMiddleware('admin', 'api', true), function(req, res) {
    if (
        !req.body.name ||
        !req.body.desc ||
        !req.body.location ||
        !req.body.startDate
    ) {
        res.send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
        return;
    }
    Event.find()
        .byName(req.body.name)
        .exec()
        .then(event => {
            if (event) {
                return Location.find()
                    .byName(req.body.location)
                    .exec()
                    .then(location => {
                        req.body.location = location._id;
                        return event.updateFields(req.body);
                    })
                    .then(saved => {
                        res.status(200).send({
                            status: true,
                            message: Responses.UPDATED,
                            event: saved
                        });
                    });
            } else {
                return Location.find()
                    .byName(req.body.location)
                    .exec()
                    .then(location => {
                        req.body.location = location._id;
                        return Event.create({
                            name: req.body.name,
                            longitude: req.body.longitude,
                            latitude: req.body.latitude
                        });
                    })
                    .then(event => {
                        return event.save();
                    })
                    .then(saved => {
                        res.status(200).send({
                            status: true,
                            message: Responses.CREATED,
                            event: saved
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

// Handles /v1/event/<event_name>
router.get('/:name', function(req, res) {
    Event.find()
        .byName(req.params.name)
        .exec()
        .then(event => {
            if (event) {
                res.send({
                    status: true,
                    event: event
                });
            } else {
                res.status(401).send({
                    status: false,
                    message: Responses.NOT_FOUND
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

// Handles /v1/event/
router.get('/', function(req, res) {
    console.log(req.params);
    Event.find({})
        .exec()
        .then(events => {
            if (events) {
                res.send({
                    status: true,
                    events: events
                });
            } else {
                res.status(401).send({
                    status: false,
                    message: Responses.NOT_FOUND
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

module.exports = router;
