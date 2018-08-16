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
    var levels = ['platinum', 'gold', 'silver', 'bronze'];

    var levelsData = {
        platinum: [],
        gold: [],
        silver: [],
        bronze: []
    };

    sponsors.forEach(function(sponsor) {
        if (sponsor.level in levelsData) {
            levelsData[sponsor.level].push(sponsor);
        } else {
            levelsData[sponsor.level] = [sponsor];
        }
    });

    return [levels, levelsData];
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
    var sponsorsList, sponsors;
    authMiddleware('admin', 'api', true, function() {
        Sponsor.find({}, '-logo')
            .then(sponsorsDocs => {
                [sponsorsList, sponsors] = sortSponsors(sponsorsDocs);

                res.send({
                    status: true,
                    sponsors: sponsors,
                    sponsorsList: sponsorsList
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
            .then(sponsorsDocs => {
                [sponsorsList, sponsors] = sortSponsors(sponsorsDocs);

                res.send({
                    status: true,
                    sponsors: sponsors,
                    sponsorsList: sponsorsList
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
                                mime.getType(stream[0])
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
