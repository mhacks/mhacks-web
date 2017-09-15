var router = require('express').Router(),
    authMiddleware = require('../../middleware/auth.js'),
    Responses = require('../../responses/api/index.js'),
    Device = require('../../db/model/Device.js');

router.post(
    '/',
    authMiddleware(
        'any',
        'api',
        false,
        function(req, res) {
            if (req.body.push_id) {
                Device.create({
                    push_id: req.body.push_id,
                    push_categories: req.body.push_categories
                })
                    .then(device => {
                        res.send({
                            status: true,
                            device: device
                        });
                    })
                    .catch(err => {
                        res.send({
                            status: false,
                            message: err
                        });
                    });
            } else {
                res.status(400).send({
                    status: false,
                    message: Responses.MISSING_PARAMETERS
                });
            }
        },
        false
    ),
    function(req, res) {
        if (req.body.push_id) {
            Device.create({
                user: req.user,
                push_id: req.body.push_id,
                push_categories: req.body.push_categories
            })
                .then(device => {
                    res.send({
                        status: true,
                        device: device
                    });
                })
                .catch(err => {
                    res.send({
                        status: false,
                        message: err
                    });
                });
        } else {
            res.status(400).send({
                status: false,
                message: Responses.MISSING_PARAMETERS
            });
        }
    }
);

module.exports = router;
