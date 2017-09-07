var router = require('express').Router(),
    Team = require('../../db/model/Team.js'),
    authMiddleware = require('../../middleware/auth.js'),
    Responses = require('../../responses/api/announcement.js');

// Handles get requests for /v1/teams
router.get('/', function(req, res) {
    authMiddleware('admin', 'api', true, function() {
        Team.find({}, '-_id -__v')
            .exec()
            .then(teams => {
                res.send({
                    status: true,
                    teams: teams
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
        Team.find({}, '-_id -__v')
            .exec()
            .then(teams => {
                res.send({
                    status: true,
                    teams: teams
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

router.post('/create', /*authMiddleware('admin', 'api'),*/ function(req, res) {
    if (!req.session.loggedIn) {
        if (req.body.name && req.body.members && req.body.description) {
            Team.create({
                name: req.body.name,
                members: req.body.members,
                description: req.body.description
            })
                .then(team => {
                    res.send({
                        status: true,
                        team: team
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
            res.status(401).send({
                status: false,
                message: Responses.PARAMS_NOT_FOUND
            });
        }
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PERMISSIONS_REQUIRED
        });
    }
});

router.post('/add', /*authMiddleware('admin', 'api'),*/ function(req, res) {
    if (!req.session.loggedIn) {
        if (req.body.member && req.body.skill) {
            Team.create({
                name: req.body.name,
                members: req.body.members,
                description: req.body.description
            })
                .then(team => {
                    res.send({
                        status: true,
                        team: team
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
            res.status(401).send({
                status: false,
                message: Responses.PARAMS_NOT_FOUND
            });
        }
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PERMISSIONS_REQUIRED
        });
    }
});

module.exports = router;
