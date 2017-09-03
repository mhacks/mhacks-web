var router = require('express').Router(),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    Location = require('../../db/model/Location.js');

router.post('/', authMiddleware('admin', 'api', true), function(req, res) {
    if (!req.body.name || !req.body.longitude || !req.body.latitude) {
        res.send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
        return;
    }
    Location.find()
        .byName(req.body.name)
        .exec()
        .then(location => {
            if (location) {
                return location
                    .updateFields({
                        longitude: req.body.longitude,
                        latitude: req.body.latitude
                    })
                    .then(saved => {
                        res.status(200).send({
                            status: true,
                            message: Responses.UPDATED,
                            location: saved
                        });
                    });
            } else {
                return Location.create({
                    name: req.body.name,
                    longitude: req.body.longitude,
                    latitude: req.body.latitude
                })
                    .then(loc => {
                        return loc.save();
                    })
                    .then(saved => {
                        res.status(200).send({
                            status: true,
                            message: Responses.CREATED,
                            location: saved
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

// Handles /v1/location/<location_name>
router.get('/:name', function(req, res) {
    Location.find()
        .byName(req.params.name)
        .exec()
        .then(location => {
            if (location) {
                res.send({
                    status: true,
                    location: location
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

// Handles /v1/location/
router.get('/', function(req, res) {
    console.log(req.params);
    Location.find({})
        .exec()
        .then(locations => {
            if (locations) {
                res.send({
                    status: true,
                    locations: locations
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
