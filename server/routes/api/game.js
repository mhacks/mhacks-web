var router = require('express').Router(),
    Responses = require('../../responses/api'),
    authMiddleware = require('../../middleware/auth.js'),
    GameState = require('../../db/model/GameState.js'),
    config = require('../../../config/default.js'),
    Questions = require('../../../static/misc/game-questions.json'),
    User = require('../../db/model/User.js');

// Handles /v1/game/questions
router.get('/questions', function(req, res) {
    res.send({
        status: true,
        questions: Questions
    });
});

// Returns GameState for the current user
router.get('/', authMiddleware('any', 'api'), function(req, res) {
    GameState.find({})
        .byToken(req.authToken)
        .then(gameState => {
            if (
                gameState !== undefined &&
                gameState.quests.length < config.game_max_quests
            ) {
                gameState.fillQuests();
                gameState.save();
            }

            res.send({
                status: true,
                state: gameState || {}
            });
        })
        .catch(() => {
            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

// Create/update answers in GameState
router.post('/', authMiddleware('any', 'api'), function(req, res) {
    GameState.find()
        .byToken(req.authToken)
        .then(state => {
            if (state) {
                for (const [question, answer] of Object.entries(
                    req.body.answers
                )) {
                    state.answers.set(question, answer);
                }

                state.fillQuests();
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
                            answers: {},
                            points: 0,
                            quests: []
                        })
                            .then(state => {
                                for (const [question, answer] of Object.entries(
                                    req.body.answers
                                )) {
                                    state.answers.set(question, answer);
                                }

                                state.fillQuests();
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

// Handle code scans
router.post('/scan', authMiddleware('any', 'api'), function(req, res) {
    const scannedEmail = req.body.email;
    const questName = req.body.quest;

    if (scannedEmail === req.user.email) {
        return res.status(400).send({
            status: false,
            message: Responses.SELF_SCAN
        });
    }

    // TODO: Check if user is eligible to be scanned
    // (confirmation? registration scan?)
    GameState.findOne()
        .byEmail(scannedEmail)
        .then(scannedState => {
            if (!scannedState) {
                throw new Error('User not found with email ' + scannedEmail);
            }

            GameState.find()
                .byUser(req.user)
                .then(currentUserState => {
                    // Check if quest exists in our current user
                    const foundQuests = currentUserState.quests.filter(
                        quest => quest.question === questName
                    );

                    if (foundQuests.length === 0) {
                        return res.status(404).send({
                            status: false,
                            message: Responses.NOT_FOUND
                        });
                    }
                    // If we get here, something bad happened in our quest generation
                    // (we shouldn't have any duplicates), so let's just kill the request
                    else if (foundQuests.length > 1) {
                        return res.status(500).send({
                            status: false,
                            message: Responses.UNKNOWN_ERROR
                        });
                    }

                    const currentQuest = foundQuests[0];

                    // Has this user has already been scanned by the user (or quest)?
                    if (
                        currentUserState.scans.includes(scannedState.user) ||
                        currentQuest.scans.includes(scannedState.user)
                    ) {
                        return res.status(400).send({
                            status: false,
                            message: Responses.ALREADY_SCANNED
                        });
                    }

                    // Does the user's answer not match the quest (or not exist)?
                    if (
                        scannedState.answers.get(currentQuest.question) ===
                            undefined ||
                        scannedState.answers.get(currentQuest.question) !==
                            currentQuest.answer
                    ) {
                        return res.status(400).send({
                            status: false,
                            message: Responses.INCORRECT_ANSWER
                        });
                    }

                    // If we make it here, the scanned user's answer
                    // should match the quest's required answer.
                    currentQuest.scans.push(scannedState.user);
                    currentUserState.scans.push(scannedState.user);

                    // Check if enough scans have been collected on the quest for completion.
                    // If we don't want to use this feature, we can just leave requiredScans
                    // as 1 on all quests
                    if (
                        currentQuest.scans.length >= currentQuest.requiredScans
                    ) {
                        currentUserState.points += currentQuest.points;

                        // Remove this quest from the user's quests
                        currentUserState.quests = currentUserState.quests.filter(
                            quest => quest.question !== currentQuest.question
                        );

                        currentUserState.completedQuests.push(currentQuest);
                        currentUserState.markModified('completedQuests');

                        // Generate a new quest for the user
                        currentUserState.fillQuests();
                    }

                    currentUserState.save();
                    res.send({
                        status: true,
                        state: currentUserState
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
        .catch(() => {
            res.status(404).send({
                status: false,
                message: Responses.NOT_FOUND
            });
        });
});

module.exports = router;
