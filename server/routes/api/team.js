var router = require('express').Router(),
    Team = require('../../db/model/Team.js'),
    Application = require('../../db/model/Application.js'),
    Responses = require('../../responses/api/team.js');

// Handles get requests for /v1/teams
router.get('/', function(req, res) {
    Team.find()
        .populate('members', 'full_name email avatar')
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

router.post('/', function(req, res) {
    if (req.body.name && req.body.description && req.user) {
        Application.find()
            .byEmail(req.user.email)
            .then(application => {
                if (application && application.status === 'accepted') {
                    if (req.body.description.length >= 100) {
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
                        message: Responses.NOT_ACCEPTED
                    });
                }
            });
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PARAMS_NOT_FOUND
        });
    }
});

router.delete('/', function(req, res) {
    if (req.user && req.body.team) {
        Team.findById(req.body.team)
            .then(team => {
                //Check if person removing team is leader (first in array)
                if (team && team.members.indexOf(req.user._id) === 0) {
                    team.remove();
                    res.send({
                        status: true
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
});

router.post('/member', function(req, res) {
    if (req.user && req.body.team) {
        Application.find()
            .byEmail(req.user.email)
            .then(application => {
                if (application && application.status === 'accepted') {
                    Team.findById(req.body.team)
                        .then(team => {
                            if (team && team.members.length < 4) {
                                team.members.addToSet(req.user._id);
                                team.save(function(){
                                    Team.populate(team, {path:'members', select:'email full_name'}, function(){
                                        res.send({
                                            status: true,
                                            team: team
                                        });
                                    });
                                });
                                //Check for adopt a noob
                            } else if (team && team.members.length < 5) {
                                Application.find({
                                    user: {
                                        $in: team.members.map(
                                            member => member.email
                                        )
                                    }
                                })
                                    .select('experience -_id')
                                    .then(applications => {
                                        var apps = applications.map(
                                            item => item['experience']
                                        );
                                        apps.push(application.experience);
                                        if (checkGoodTeam(apps)) {
                                            team.members.addToSet(req.user._id);
                                            team.save();
                                            res.send({
                                                status: true,
                                                team: team
                                            });
                                        } else {
                                            res.status(403).send({
                                                status: false,
                                                message:
                                                    Responses.NOT_QUALIFIED_NOOB
                                            });
                                        }
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
                        message: Responses.NOT_ACCEPTED
                    });
                }
            });
    } else {
        res.status(401).send({
            status: false,
            message: Responses.PARAMS_NOT_FOUND
        });
    }
});

router.delete('/member', function(req, res) {
    if (req.user && req.body.team) {
        Team.findById(req.body.team)
            .then(team => {
                if (team.members.length > 1) {
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
});

function checkGoodTeam(experiences) {
    var noviceCount = 0;
    var expertCount = 0;
    var veteranCount = 0;
    for (var i = 0; i < experiences.length; i++) {
        switch (experiences[i]) {
            case 'novice':
                noviceCount++;
                break;
            case 'expert':
                expertCount++;
                break;
            case 'veteran':
                veteranCount++;
                break;
        }
    }
    if ((veteranCount > 0 || expertCount > 1) && noviceCount > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports = router;
