var router = require('express').Router(),
    Floor = require('../../db/model/Floor.js'),
    Responses = require('../../responses/api/announcement.js');

// Handles get requests for /v1/floor
router.get('/', function(req, res) {
    Floor.find()
        .since(req.query.since)
        .exec()
        .then(floors => {
            res.send({
                status: true,
                floors: floors
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

module.exports = router;
