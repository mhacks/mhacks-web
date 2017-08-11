var router = require('express').Router(),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    Sponsor = require('../../db/model/Sponsor.js'),
    config = require('../../../config/default.js'),
    uploadHelper = require('../../interactors/multer-s3.js')(
        config.AWS_BUCKET_NAME,
        true
    );

router.post('/', authMiddleware('admin', 'api'), uploadHelper.fields([{ name: 'avatar' }]), function (req, res) {
    if (req.files && req.files.avatar) {
        req.body.logo =
            req.files.avatar[0].location ||
            '/uploads/ ' + req.files.avatar[0].filename;
    }

    if (req.body.id && req.body.name && req.body.domain && req.body.level && req.body.logo && req.body.logo_size) {
        Sponsor.updateOne({ _id: req.body.id }, req.body, {
            runValidators: true
        })
            .then(sponsor => {
                res.send({
                    status: true,
                    sponsor: sponsor
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    } else if (req.body.name && req.body.domain && req.body.level && req.body.logo && req.body.logo_size) {
        Sponsor.create(req.body).then(sponsor => {
            res.send({
                status: true,
                sponsor: sponsor
            });
        }).catch(err => {
            console.error(err);
            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
    }
});

router.get('/', function (req, res) {
    Sponsor.find({}, '-_id -__v -domain -logo')
        .exec()
        .then(sponsors => {
            res.send({
                status: true,
                sponsors: sponsors
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
