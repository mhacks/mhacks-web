var router = require('express').Router(),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    Sponsor = require('../../db/model/Sponsor.js'),
    config = require('../../../config/default.js'),
    uploadHelper = require('../../interactors/multer-s3.js')(
        config.AWS_BUCKET_NAME,
        true
    ),
    artifact = require('../../interactors/artifact.js'),
    mime = require('mime');

function sortSponsors(sponsors) {
    var levels = {
        unobtanium: [],
        gold: [],
        silver: [],
        bronze: []
    };

    sponsors.forEach(function(sponsor) {
        if (sponsor.level in levels) {
            levels[sponsor.level].push(sponsor);
        } else {
            levels[sponsor.level] = [sponsor];
        }
    });

    return levels;
}

router.post(
    '/',
    authMiddleware('admin', 'api'),
    uploadHelper.fields([{ name: 'avatar' }]),
    function(req, res) {
        if (req.files && req.files.avatar) {
            req.body.logo =
                req.files.avatar[0].location ||
                '/uploads/' + req.files.avatar[0].filename;
        }

        if (
            req.body.id &&
            req.body.name &&
            req.body.domain &&
            req.body.level &&
            req.body.logo &&
            req.body.logo_size
        ) {
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
        } else if (
            req.body.name &&
            req.body.domain &&
            req.body.level &&
            req.body.logo &&
            req.body.logo_size
        ) {
            Sponsor.create(req.body)
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
        } else {
            res.status(400).send({
                status: false,
                message: Responses.MISSING_PARAMETERS
            });
        }
    }
);

router.get('/', function(req, res) {
    authMiddleware('admin', 'api', true, function() {
        Sponsor.find({}, '-domain -logo')
            .exec()
            .then(sponsors => {
                sponsors = sortSponsors(sponsors);

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
    })(req, res, function() {
        Sponsor.find({})
            .exec()
            .then(sponsors => {
                sponsors = sortSponsors(sponsors);

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
});

router.get('/logo/:id', function(req, res) {
    if (req.params.id) {
        Sponsor.findOne({ _id: req.params.id })
            .exec()
            .then(sponsor => {
                if (sponsor) {
                    artifact(
                        sponsor.domain,
                        'avatar',
                        false,
                        sponsor.logo.split('/').pop()
                    )
                        .then(stream => {
                            res.setHeader(
                                'Content-Type',
                                mime.lookup(stream[0])
                            );
                            res.send(stream[1].data.Body);
                        })
                        .catch(err => {
                            res.status(500).send({
                                status: false,
                                message: err.message
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
                res.send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    } else {
        res.status(400).send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
    }
});

module.exports = router;
