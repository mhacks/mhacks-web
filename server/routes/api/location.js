var router = require('express').Router(),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    Location = require('../../db/model/Location.js');

router.post( '/location/',
    // authMiddleware('any', 'api', true),
    function (req, res) {
        if (!req.body.name || !req.body.longitude || !req.body.latitude) {
            res.send({
                status: false,
                message: Responses.MISSING_PARAMETERS
            });
        }
        Location.find()
        .byName(req.body.name)
        .exec()
        .then(location => {
            if (location) {
                return location.updateLocation({
                    longitude: req.body.longitude,
                    latitude: req.body.latitude
                })
                .then(saved => {
                    res.status(200).send({
                        status: true,
                        message: Responses.Location.UPDATED,
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
                    return loc.save()
                })
                .then(saved => {
                    res.status(200).send({
                        status: true,
                        message: Responses.Location.CREATED,
                        location: saved
                    });
                });
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
    }
);

// Handles /v1/location/<location_name>
router.get('/location/:name', function (req, res) {
    Location.find()
    .byName(req.params.name)
    .exec()
    .then(location => {
        if (location) {
            return location.getCoordinates()
            .then(coordinates => {
                res.send({
                    status: true,
                    coordinates: coordinates
                });
            });
        } else {
            res.status(401).send({
                status: false,
                message: Responses.NOT_FOUND
            });
        }
    })
    .catch(err => {
        console.error(err)
        res.status(500).send({
            status: false,
            message: Responses.UNKNOWN_ERROR
        });
    });
});

module.exports = router;
