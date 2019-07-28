var router = require('express').Router(),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    GameState = require('../../db/model/GameState.js'),
    Questions = require('../../../static/misc/game-questions.json'),
    User = require('../../db/model/User.js');

// Handles /v1/game/questions
router.get('/questions', function (req, res) {
    res.send({
        status: true,
        questions: Questions
    });
});

// Returns GameState for the current user
router.get('/', authMiddleware('any', 'api'), function (req, res) {
    GameState.find({})
        .byToken(req.authToken)
        .then(gameState => {
            res.send({
                status: true,
                state: gameState || {}
            });
        })
        .catch(() => {
            res.send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

// Create/update answers in GameState
router.post('/', authMiddleware('any', 'api'), function (req, res) {
    GameState.find()
        .byToken(req.authToken)
        .then(state => {
            if (state) {
                for (const [question, answer] of Object.entries(req.body.answers)) {
                    state.answers.set(question, answer);
                }
                state.save();

                res.send({
                    status: true,
                    state: state
                });
            } else {
                User.find()
                    .byToken(req.authToken)
                    .then(user => {
                        GameState.create({
                            user: user.id,
                            points: 0,
                            answers: {}
                        })
                            .then(state => {
                                for (const [question, answer] of Object.entries(req.body.answers)) {
                                    state.answers.set(question, answer);
                                }
                                state.save();

                                res.send({
                                    status: true,
                                    state: state
                                });
                            })
                            .catch(err => {
                                console.error(err);
                                res.status(500).send({
                                    status: false,
                                    message: Responses.UNKNOWN_ERROR
                                });
                            });
                    })
                    .catch(err => {
                        console.error(err);
                        res.send({
                            status: false,
                            message: Responses.UNKNOWN_ERROR
                        });
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
});

module.exports = router;
