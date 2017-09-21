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
            var emails = [];
            var map = {};

            teams.map(team => {
                team.members.map(member => {
                    emails.push(member.email);
                });
            });
            Application.find({
                user: { $in: emails }
            })
                .select('experience user')
                .then(applications => {
                    applications.map(app => {
                        map[app.user] = app.experience;
                    });
                    const newTeams = teams.map(team => {
                        const newMembers = team.members.map(member => {
                            return Object.assign({}, member.toJSON(), {
                                experience: map[member.email]
                            });
                        });
                        return Object.assign({}, team.toJSON(), {
                            members: newMembers
                        });
                    });
                    res.send({
                        status: true,
                        teams: newTeams
                    });
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
        isUserNotInTeam(req.user.id)
            .then(() => {
                Application.find()
                    .byEmail(req.user.email)
                    .then(application => {
                        if (application && application.status === 'accepted') {
                            if (req.body.description.length >= 40) {
                                Team.create({
                                    name: req.body.name,
                                    description: req.body.description,
                                    members: [req.user._id]
                                })
                                    .then(() => {
                                        res.send({
                                            status: true
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
            })
            .catch(() => {
                res.status(401).send({
                    status: false,
                    message: Responses.USER_IN_TEAM
                });
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
                    team.save().then(() => {
                        res.send({
                            status: true
                        });
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
        isUserNotInTeam(req.user.id)
            .then(() => {
                Application.find()
                    .byEmail(req.user.email)
                    .then(userApplication => {
                        if (
                            userApplication &&
                            userApplication.status === 'accepted'
                        ) {
                            Team.findById(req.body.team)
                                .populate('members')
                                .then(team => {
                                    if (team && team.members.length < 4) {
                                        team.members.addToSet(req.user._id);
                                        team.save().then(() => {
                                            res.send({
                                                status: true
                                            });
                                        });
                                        //Check for adopt a noob
                                    } else if (
                                        team &&
                                        team.members.length < 5
                                    ) {
                                        Application.find({
                                            user: {
                                                $in: team.members.map(
                                                    member => member.email
                                                )
                                            }
                                        }).then(applications => {
                                            var experiences = applications.map(
                                                item => item['experience']
                                            );
                                            experiences.push(
                                                userApplication.experience
                                            );
                                            if (checkGoodTeam(experiences)) {
                                                team.members.addToSet(
                                                    req.user._id
                                                );
                                                team.save().then(() => {
                                                    res.send({
                                                        status: true
                                                    });
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
            })
            .catch(() => {
                res.status(401).send({
                    status: false,
                    message: Responses.USER_IN_TEAM
                });
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
                    team.save().then(() => {
                        Team.find()
                            .populate('members', 'email full_name avatar')
                            .exec()
                            .then(teams =>
                                res.send({
                                    status: true,
                                    teams: teams
                                })
                            );
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
    var experiencedCount = 0;
    var veteranCount = 0;
    for (var i = 0; i < experiences.length; i++) {
        switch (experiences[i]) {
            case 'novice':
                noviceCount++;
                break;
            case 'experienced':
                experiencedCount++;
                break;
            case 'veteran':
                veteranCount++;
                break;
        }
    }
    if ((veteranCount > 0 || experiencedCount > 1) && noviceCount > 0) {
        return true;
    } else {
        return false;
    }
}

function isUserNotInTeam(userId) {
    return new Promise((resolve, reject) => {
        if (userId) {
            Team.find({ members: userId }).then(teams => {
                if (teams.length > 0) {
                    reject('error');
                } else {
                    resolve(true);
                }
            });
        } else {
            resolve(true);
        }
    });
}

module.exports = router;
