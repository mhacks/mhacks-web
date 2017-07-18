var router = require('express').Router(),
    User = require('../../db/model/User.js'),
    Responses = require('../../responses/api/index.js');

router.post('/user/groups', function(req, res) {
    if (req.body.email && req.body.group) {
        User.find()
            .byEmail(req.body.email)
            .exec()
            .then(user => {
                if (user) {
                    req.body.group.split(',').forEach(function(group) {
                        if (req.body.remove) {
                            user.removeGroup(group.trim());
                        } else {
                            user.addGroup(group.trim());
                        }
                    });

                    res.send({
                        status: true,
                        user: user
                    });
                } else {
                    res.send({
                        status: false,
                        user: null
                    });
                }
            })
            .catch(err => {
                console.error(err);
                res.send({
                    status: false,
                    user: null
                });
            });
    } else {
        res.send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
    }
});

router.post('/applications', function(req, res) {
    const { users, score, status, reimbursement } = req.body;
    if (users && score && status) {
        // TODO update applications
        console.log(users, score, status, reimbursement);
        res.send({
            status: true
        });
    } else {
        res.send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
    }
});

module.exports = router;
