var router = require('express').Router(),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    Location = require('../../db/model/Location.js');

router.post('/', authMiddleware('admin', 'api', true), function(req, res) {
    var updateable_fields = Location.getUpdateableFields();
    var fields = {};

    for (var i in req.body) {
        if (updateable_fields.indexOf(i) !== -1) {
            fields[i] = req.body[i];
        }
    }

    if (req.body.id) {
        Location.findById(req.body.id)
            .then(location => {
                if (location) {
                    location.updateFields(fields).then(location => {
                        res.send({
                            status: true,
                            location
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
        Location.create(fields)
            .then(location => {
                res.send({
                    status: true,
                    location
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

// Handles /v1/location/
router.get('/', function(req, res) {
    Location.find()
        .since(req.query.since)
        .exec()
        .then(locations => {
            if (locations) {
                res.send({
                    status: true,
                    locations
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
