var router = require('express').Router(),
    Application = require('../../db/model/Application.js'),
    Responses = require('../../responses/api/index.js');

router.post('/', function(req, res) {
    if (
        req.body.hasOwnProperty('users') &&
        req.body.hasOwnProperty('score') &&
        req.body.hasOwnProperty('status') &&
        req.body.hasOwnProperty('reimbursement')
    ) {
        const { users, score, status, reimbursement } = req.body;
        users.forEach(user => {
            Application.find()
                .byEmail(user)
                .then(application => {
                    application.status = status;
                    application.score = score;
                    application.reimbursement = reimbursement;
                    application.reader = req.user;
                    application.save();

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
        });
    } else {
        res.status(401).send({
            status: false,
            message: Responses.MISSING_PARAMETERS
        });
    }
});

module.exports = router;
