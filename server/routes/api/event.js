var router = require('express').Router(),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    Event = require('../../db/model/Event.js');

function sortByDate(a, b) {
    return new Date(a.startDate) - new Date(b.startDate);
}

router.post('/', authMiddleware('admin', 'api', true), function(req, res) {
    var updateable_fields = Event.getUpdateableFields();
    var fields = {};

    for (var i in req.body) {
        if (updateable_fields.indexOf(i) !== -1) {
            fields[i] = req.body[i];
        }
    }

    if (req.body.id) {
        Event.findById(req.body.id)
            .then(event => {
                if (event) {
                    event.updateFields(fields).then(event => {
                        res.send({
                            status: true,
                            event
                        });
                    });
                } else {
                    res.status(404).send({
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
    } else {
        Event.create(fields)
            .then(event => {
                res.send({
                    status: true,
                    event
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    }
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
    Event.find()
        .since(req.query.since)
        .exec()
        .then(events => {
            if (events) {
                events.sort(sortByDate);

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
