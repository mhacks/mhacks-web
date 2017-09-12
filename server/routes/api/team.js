var router = require('express').Router(),
    Team = require('../../db/model/Team.js'),
    authMiddleware = require('../../middleware/auth.js'),
    Responses = require('../../responses/api/team.js');

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
                res.status(500).send({
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
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            });
    });
});

router.post('/', function(req, res) {
    if (req.session.loggedIn) {
        if (req.body.name && req.body.description && req.user) {
            if (req.body.description.length >= 100){
                Team.create({
                    name: req.body.name,
                    description: req.body.description,
                    members: [req.user._id]
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
                    message: Responses.DESCRIPTION_SHORT
                });
            }
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

router.delete('/', function(req, res) {
    if (req.session.loggedIn) {
        if (req.user && req.body.team) {
            Team.findById(req.body.team)
                .then(team => {
                    //Check if person removing team is leader (first in array)
                    if (team && team.members.indexOf(req.user._id) === 0){
                        team.remove();
                        res.send({
                            status: true,
                        });
                    } else {
                        res.status(403).send({
                            status: false,
                            message: Responses.NOT_LEADER
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

router.post('/member', function(req, res) {
    if (req.session.loggedIn) {
        if (req.user && req.body.team) {
            Team.findById(req.body.team)
                .then(team => {
                    //TODO check for adopt a noob
                    if(team.members.length < 4) {
                        team.members.addToSet(req.user._id);
                        team.save();
                        res.send({
                            status: true,
                            team: team
                        });
                    } else {
                        res.status(403).send({
                            status: false,
                            message: Responses.TEAM_FULL
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

router.delete('/member', function(req, res) {
    if (req.session.loggedIn) {
        if (req.user && req.body.team) {
            Team.findById(req.body.team)
                .then(team => {
                    //TODO check for adopt a noob
                    if(team.members.length > 1) {
                        team.members.pull(req.user._id);
                        team.save();
                        res.send({
                            status: true,
                            team: team
                        });
                    } else {
                        res.status(403).send({
                            status: false,
                            message: Responses.TEAM_EMPTY
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
