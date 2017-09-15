var router = require('express').Router(),
    authMiddleware = require('../../middleware/auth.js'),
    Floor = require('../../db/model/Floor.js'),
    Responses = require('../../responses/api/announcement.js'),
    config = require('../../../config/default.js'),
    uploadHelper = require('../../interactors/multer-s3.js')(
        config.AWS_BUCKET_NAME
    );

// Handles get requests for /v1/floor
router.get('/', function(req, res) {
    Floor.find()
        .since(req.query.since)
        .exec()
        .then(floors => {
            res.send({
                status: true,
                floors: floors.map(function(floor) {
                    var obj = floor.toJSON();
                    return Object.assign({}, obj, {
                        floor_image: floor.getFloorImage()
                    });
                })
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

router.post(
    '/',
    authMiddleware('admin', 'api'),
    uploadHelper.fields([{ name: 'floor_image' }]),
    function(req, res) {
        var updateable_fields = Floor.getUpdateableFields();
        var fields = {};

        if (req.files && req.files.floor_image) {
            req.body.floor_image =
                req.files.floor_image[0].location ||
                '/uploads/' + req.files.floor_image[0].filename;
        }

        for (var i in req.body) {
            if (updateable_fields.indexOf(i) !== -1) {
                fields[i] = req.body[i];
            }
        }

        if (req.body.id) {
            Floor.findById(req.body.id)
                .then(floor => {
                    if (floor) {
                        floor.updateFields(fields).then(floor => {
                            res.send({
                                status: true,
                                floor: Object.assign({}, floor.toJSON(), {
                                    floor_image: floor.getFloorImage()
                                })
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
            Floor.create(fields)
                .then(floor => {
                    res.send({
                        status: true,
                        floor: Object.assign({}, floor.toJSON(), {
                            floor_image: floor.getFloorImage()
                        })
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
    }
);

module.exports = router;
